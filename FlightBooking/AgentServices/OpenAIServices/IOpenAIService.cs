namespace FlightBooking.AgentServices.OpenAIServices
{
    public interface IOpenAIService
    {
        Task<string> GetResponseAsync(string prompt);
    }
}
