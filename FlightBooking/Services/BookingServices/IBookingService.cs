using FlightBooking.Dtos.BookingDtos;

namespace FlightBooking.Services.BookingServices
{
    public interface IBookingService
    {
        Task CreateBookingAsync(CreateBookingDto dto);
        Task<(string Name, string Surname)> GetPassengerNameByIdAsync(string passengerId);
    }
}
