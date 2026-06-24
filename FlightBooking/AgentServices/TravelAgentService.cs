
using FlightBooking.AgentServices.OpenAIServices;

namespace FlightBooking.AgentServices
{
    public class TravelAgentService : ITravelAgentService
    {
        private readonly IOpenAIService _openAIService;
        public TravelAgentService(IOpenAIService openAIService)
        {
            _openAIService = openAIService;
        }
        public async Task<string> AskAgentAsync(string prompt)
        {
            return await _openAIService.GetResponseAsync(prompt);
        }
    }
}
