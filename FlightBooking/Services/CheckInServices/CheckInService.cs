using FlightBooking.Dtos.CheckInDtos;
using FlightBooking.Entities;
using FlightBooking.Settings;
using MongoDB.Driver;

namespace FlightBooking.Services.CheckInServices
{
    public class CheckInService : ICheckInService
    {
        private readonly IMongoCollection<Booking> _bookingCollection;
        private readonly IMongoCollection<CheckIn> _checkInCollection;

        public CheckInService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _bookingCollection = database.GetCollection<Booking>(settings.BookingCollectionName);
            _checkInCollection = database.GetCollection<CheckIn>(settings.CheckInCollectionName);
        }
        public Task CompleteCheckInAsync(CompleteCheckInDto dto)
        {
            throw new NotImplementedException();
        }
    }
}
