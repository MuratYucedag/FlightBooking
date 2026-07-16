
using FlightBooking.AgentServices.CityDetectors;
using FlightBooking.AgentServices.IntentDetectors;
using FlightBooking.AgentServices.OpenAIServices;
using FlightBooking.AgentServices.PromptBuilders;
using FlightBooking.Dtos.AgentDtos;
using FlightBooking.Tools.WeatherTool;

namespace FlightBooking.AgentServices
{
    public class TravelAgentService : ITravelAgentService
    {
        private readonly IOpenAIService _openAIService;
        private readonly ITravelPromptBuilder _promptBuilder;
        private readonly IIntentDetector _intentDetector;
        private readonly IWeatherTool _weatherTool;
        private readonly ICityExtractor _cityExtractor;
        public TravelAgentService(IOpenAIService openAIService, ITravelPromptBuilder promptBuilder, IIntentDetector intentDetector, IWeatherTool weatherTool, ICityExtractor cityExtractor)
        {
            _openAIService = openAIService;
            _promptBuilder = promptBuilder;
            _intentDetector = intentDetector;
            _weatherTool = weatherTool;
            _cityExtractor = cityExtractor;
        }
        public async Task<AgentResponseDto> AskAgentAsync(string prompt)
        {
            var intent = _intentDetector.Detect(prompt);

            string intentInstruction;

            var city = await _cityExtractor.ExtractCityAsync(prompt);

            switch (intent)
            {
                case TravelIntent.Weather:
                    var weatherResult = await _weatherTool.GetWeatherAsync("Amsterdam");

                    intentInstruction =
                        $"Kullanıcı hava durumu bilgisi istiyor. " +
                        $"Gerçek hava durumu verisi: " +
                        $"Şehir: {weatherResult.City}, " +
                        $"Sıcaklık: {weatherResult.Temperature}°C, " +
                        $"Durum: {weatherResult.Condition}, " +
                        $"Nem: %{weatherResult.Humidity}, " +
                        $"Rüzgar: {weatherResult.WindSpeed} km/s. " +
                        $"Bu verilere göre kullanıcıya seyahat ve kıyafet önerisi ver.";
                    break;

                case TravelIntent.Restaurant:
                    intentInstruction =
                        "Kullanıcı restoran önerisi istiyor.";
                    break;

                case TravelIntent.Hotel:
                    intentInstruction =
                        "Kullanıcı otel önerisi istiyor.";
                    break;

                default:
                    intentInstruction =
                        "Kullanıcının seyahatle ilgili sorusuna yardımcı ol.";
                    break;
            }

            var finalPrompt = _promptBuilder.BuildPrompt(
                $"{intentInstruction}\n\nKullanıcının gerçek sorusu:\n{prompt}");

            var result = await _openAIService.GetResponseAsync(finalPrompt);

            result.Intent = intent.ToString();

            return result;
        }
    }
}
/*
 public async Task<AgentResponseDto> AskAgentAsync(string prompt)
{
    var intent = _intentDetector.Detect(prompt);

    var finalPrompt = _promptBuilder.BuildPrompt(prompt);

    var result = await _openAIService.GetResponseAsync(finalPrompt);

    result.Intent = intent.ToString();

    return result; 

var intent = _intentDetector.Detect(prompt);

            var finalPrompt = _promptBuilder.BuildPrompt(prompt);

            var result = await _openAIService.GetResponseAsync(finalPrompt);

            result.Intent = intent.ToString();

            return result;
}
 */