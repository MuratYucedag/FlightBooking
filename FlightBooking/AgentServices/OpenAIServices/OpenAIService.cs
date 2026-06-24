
using FlightBooking.AgentSettings;
using Microsoft.Extensions.Options;
using System.Text;
using System.Text.Json;

namespace FlightBooking.AgentServices.OpenAIServices
{
    public class OpenAIService : IOpenAIService
    {
        private readonly HttpClient _httpClient;
        private readonly OpenAISettings _settings;
        public OpenAIService(HttpClient httpClient, IOptions<OpenAISettings> settings)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
        }
        public async Task<string> GetResponseAsync(string prompt)
        {
            var requestBody = new
            {
                model = _settings.Model,
                messages = new[]
                {
                    new
                    {
                        role = "system",
                        content = "Sen bir seyahat ve restoran öneri asistanısın. Kısa, net ve kullanıcı dostu cevap ver."
                    },
                    new
                    {
                        role = "user",
                        content = prompt
                    }
                },
                temperature = 0.7
            };

            var json = JsonSerializer.Serialize(requestBody);

            var request = new HttpRequestMessage(
                HttpMethod.Post, "https://api.openai.com/v1/chat/completions");

            request.Headers.Add("Authorization", $"Bearer {_settings.ApiKey}");
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);

            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return $"OpenAI API hatası: {responseContent}";
            }

            using var document = JsonDocument.Parse(responseContent);

            var result = document
                .RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return result ?? "Cevap alınamadı.";
        }
    }
}

