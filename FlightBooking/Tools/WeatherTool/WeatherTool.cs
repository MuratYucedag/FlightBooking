using FlightBooking.Dtos.AgentDtos;

namespace FlightBooking.Tools.WeatherTool
{
    public class WeatherTool : IWeatherTool
    {
        public async Task<WeatherResult> GetWeatherAsync(string city)
        {
            return await Task.FromResult(new WeatherResult
            {
                City = city,
                Temperature = 24,
                Condition = "Güneşli",
                Humidity = 58,
                WindSpeed = 11,
                Advice = "Güneş gözlüğü almanız önerilir."
            });
        }
    }
}
