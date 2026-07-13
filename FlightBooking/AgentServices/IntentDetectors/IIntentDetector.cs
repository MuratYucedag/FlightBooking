namespace FlightBooking.AgentServices.IntentDetectors
{
    public interface IIntentDetector
    {
        TravelIntent Detect(string prompt);
    }
    public enum TravelIntent
    {
        Unknown,
        Restaurant,
        Weather,
        Hotel,
        Transportation,
        Currency,
        Itinerary,
        Attraction
    }
}
