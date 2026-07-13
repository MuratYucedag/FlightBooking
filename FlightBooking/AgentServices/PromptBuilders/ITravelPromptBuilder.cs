namespace FlightBooking.AgentServices.PromptBuilders
{
    public interface ITravelPromptBuilder
    {
        string BuildPrompt(string userPrompt);
    }
}
