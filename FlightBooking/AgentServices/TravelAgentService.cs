
using FlightBooking.AgentServices.IntentDetectors;
using FlightBooking.AgentServices.OpenAIServices;
using FlightBooking.AgentServices.PromptBuilders;
using FlightBooking.Dtos.AgentDtos;

namespace FlightBooking.AgentServices
{
    public class TravelAgentService : ITravelAgentService
    {
        private readonly IOpenAIService _openAIService;
        private readonly ITravelPromptBuilder _promptBuilder;
        private readonly IIntentDetector _intentDetector;
        public TravelAgentService(IOpenAIService openAIService, ITravelPromptBuilder promptBuilder, IIntentDetector intentDetector)
        {
            _openAIService = openAIService;
            _promptBuilder = promptBuilder;
            _intentDetector = intentDetector;
        }
        public async Task<AgentResponseDto> AskAgentAsync(string prompt)
        {
            var intent = _intentDetector.Detect(prompt);

            string intentInstruction;

            switch (intent)
            {
                case TravelIntent.Restaurant:
                    intentInstruction =
                        "Kullanıcı restoran önerisi istiyor. Mekanları açıklama, fiyat seviyesi ve ulaşım bilgileriyle listele.";
                    break;

                case TravelIntent.Hotel:
                    intentInstruction =
                        "Kullanıcı otel önerisi istiyor. Konum, aile uygunluğu, fiyat seviyesi ve ulaşım bilgilerini belirt.";
                    break;

                case TravelIntent.Weather:
                    intentInstruction =
                        "Kullanıcı hava durumu bilgisi istiyor.";
                    break;

                case TravelIntent.Transportation:
                    intentInstruction =
                        "Kullanıcı ulaşım seçeneklerini karşılaştırmak istiyor.";
                    break;

                case TravelIntent.Currency:
                    intentInstruction =
                        "Kullanıcı döviz kuru bilgisi istiyor.";
                    break;

                case TravelIntent.Itinerary:
                    intentInstruction =
                        "Kullanıcı günlük bir seyahat programı istiyor.";
                    break;

                case TravelIntent.Attraction:
                    intentInstruction =
                        "Kullanıcı gezilecek yer önerileri istiyor.";
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