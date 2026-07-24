using FlightBooking.Dtos.RestaurantDtos;

namespace FlightBooking.AgentServices.GooglePlacesServices
{
    public interface IGooglePlacesService
    {
        Task<List<RestaurantDto>> SearchRestaurantsAsync(string query);
    }
}