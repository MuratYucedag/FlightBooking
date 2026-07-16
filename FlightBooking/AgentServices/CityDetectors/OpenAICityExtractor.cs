using FlightBooking.AgentSettings;
using Microsoft.Extensions.Options;
using System.Text;
using System.Text.Json;

namespace FlightBooking.AgentServices.CityDetectors
{
    public class OpenAICityExtractor : ICityExtractor
    {
        private readonly HttpClient _httpClient;
        private readonly OpenAISettings _settings;
        public OpenAICityExtractor(HttpClient httpClient, IOptions<OpenAISettings> settings)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
        }

        public async Task<string?> ExtractCityAsync(string prompt)
        {
            if (string.IsNullOrWhiteSpace(prompt))
                return null;

            var extractionPrompt =
                "Aşağıdaki kullanıcı mesajında geçen şehir veya ilçe adını tespit et. " +
                "Sadece konum adını döndür. Açıklama, noktalama veya ek metin yazma. " +
                "Mesajda şehir ya da ilçe yoksa yalnızca NONE yaz.\n\n" +
                $"Kullanıcı mesajı: {prompt}";

            var requestBody = new
            {
                model = _settings.Model,
                messages = new[]
                {
                    new
                    {
                        role = "system",
                        content = "Sen kullanıcı mesajlarından şehir ve ilçe adlarını çıkaran bir bilgi çıkarım servisinin parçasısın."
                    },
                    new
                    {
                        role = "user",
                        content = extractionPrompt
                    }
                },
                temperature = 0
            };

            var json = JsonSerializer.Serialize(requestBody);

            using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");

            request.Headers.Add("Authorization", $"Bearer {_settings.ApiKey}");

            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return null;

            using var document = JsonDocument.Parse(responseContent);

            var city = document.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString()
                ?.Trim();

            if (string.IsNullOrWhiteSpace(city) || city.Equals("NONE", StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }

            return city;
        }
    }
}
