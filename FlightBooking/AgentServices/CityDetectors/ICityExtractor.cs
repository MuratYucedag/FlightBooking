namespace FlightBooking.AgentServices.CityDetectors
{
    public interface ICityExtractor
    {
        Task<string?> ExtractCityAsync(string prompt);
    }
}
