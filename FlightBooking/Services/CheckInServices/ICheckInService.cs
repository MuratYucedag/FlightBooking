using FlightBooking.Dtos.CheckInDtos;

namespace FlightBooking.Services.CheckInServices
{
    public interface ICheckInService
    {
        Task CompleteCheckInAsync(CompleteCheckInDto dto);
    }
}
