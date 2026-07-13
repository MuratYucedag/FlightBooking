using FlightBooking.Dtos.AgentDtos;

namespace FlightBooking.AgentServices.OpenAIServices
{
    public interface IOpenAIService
    {
        Task<AgentResponseDto> GetResponseAsync(string prompt);
    }
}
