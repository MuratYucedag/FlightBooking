using FlightBooking.Dtos.AgentDtos;

namespace FlightBooking.Tools.WeatherTool
{
    public interface IWeatherTool
    {
        Task<WeatherResult> GetWeatherAsync(string city);
    }
}
