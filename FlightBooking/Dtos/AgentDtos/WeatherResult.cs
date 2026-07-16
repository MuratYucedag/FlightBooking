namespace FlightBooking.Dtos.AgentDtos
{
    public class WeatherResult
    {
        public string City { get; set; }
        public decimal Temperature { get; set; }
        public decimal FeelsLike { get; set; }
        public string Condition { get; set; }
        public int Humidity { get; set; }
        public double WindSpeed { get; set; }
        public DateTime Sunrise { get; set; }
        public DateTime Sunset { get; set; }
        public string Advice { get; set; }
    }
}
