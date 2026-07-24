using FlightBooking.Dtos.WeatherDtos;

namespace FlightBooking.Dtos.AgentDtos
{
    public class WeatherResult
    {
        public string City { get; set; }
        public string Country { get; set; }
        public string TimeZoneId { get; set; }

        public decimal Temperature { get; set; }
        public string Condition { get; set; }

        public int Humidity { get; set; }
        public double WindSpeed { get; set; }
        public string WindDirection { get; set; }

        public int Visibility { get; set; }
        public int Pressure { get; set; }

        public string Sunrise { get; set; }
        public string Sunset { get; set; }

        public List<WeatherForecastResult> Forecasts { get; set; } = new();
    }
}
