using FlightBooking.Dtos.BookingDtos;
using FlightBooking.Entities;
using FlightBooking.Settings;
using MongoDB.Driver;

namespace FlightBooking.Services.BookingServices
{
    public class BookingService : IBookingService
    {
        private readonly IMongoCollection<Booking> _bookingCollection;
        private readonly IMongoCollection<Flight> _flightCollection;
        public BookingService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _bookingCollection = database.GetCollection<Booking>(settings.BookingCollectionName);
            _flightCollection = database.GetCollection<Flight>(settings.FlightCollectionName);
        }

        public async Task CreateBookingAsync(CreateBookingDto dto)
        {
            // 🔥 1. Flight çek
            var flight = await _flightCollection
                .Find(x => x.FlightId == dto.FlightId)
                .FirstOrDefaultAsync();

            //if (flight == null)
            //    throw new Exception("Uçuş bulunamadı");

            // 🔥 2. Yolcu sayısı
            var passengerCount = dto.Passengers.Count;

            //// 🔥 3. Koltuk kontrol
            //if (flight.AvailableSeats < passengerCount)
            //    throw new Exception("Yeterli koltuk yok");

            // 🔥 4. Passenger mapping
            var passengers = dto.Passengers.Select(x => new Passenger
            {
                Name = x.Name,
                Surname = x.Surname,
                BirthDate = x.BirthDate,
                Gender = x.Gender,
                PassengerType = x.PassengerType
            }).ToList();

            // 🔥 5. Fiyat hesaplama
            var totalPrice = passengerCount * flight.BasePrice;

            var pnr = await GenerateUniquePnrAsync();

            // 🔥 6. Booking oluştur
            var booking = new Booking
            {
                FlightId = dto.FlightId,
                Passengers = passengers,

                ContactName = dto.ContactName,
                ContactEmail = dto.ContactEmail,
                ContactPhone = dto.ContactPhone,

                TotalPrice = totalPrice,
                BookingDate = DateTime.Now,
                Status = "Confirmed",
                PnrNumber = pnr // 🔥 BURASI
            };



            await _bookingCollection.InsertOneAsync(booking);

            //// 🔥 7. Koltuk düş
            //var update = Builders<Flight>.Update
            //    .Inc(x => x.AvailableSeats, -passengerCount);

            //await _flightCollection.UpdateOneAsync(
            //    x => x.FlightId == dto.FlightId,
            //    update
            //);
        }

        public async Task<string> GetGateByPassengerIdAsync(string passengerId)
        {
            var booking = await _bookingCollection.Find(x => x.Passengers.Any(p => p.PassengerId == passengerId)).FirstOrDefaultAsync();

            if (booking == null)
                return null;

            var passenger = booking.Passengers.FirstOrDefault(p => p.PassengerId == passengerId);

            if (passenger == null)
                return null;

            return passenger.Gate;
        }

        public async Task<(string Name, string Surname)> GetPassengerNameByIdAsync(string passengerId)
        {
            // 🔥 1. İçinde bu passenger olan booking’i bul
            var booking = await _bookingCollection.Find(x => x.Passengers.Any(p => p.PassengerId == passengerId)).FirstOrDefaultAsync();

            if (booking == null)
                return (null, null);

            // 🔥 2. Booking içinden passenger’ı çek
            var passenger = booking.Passengers.FirstOrDefault(p => p.PassengerId == passengerId);

            if (passenger == null)
                return (null, null);

            // 🔥 3. Name + Surname dön
            return (passenger.Name, passenger.Surname);
        }

        public async Task<string> GetPnrByPassengerIdAsync(string passengerId)
        {
            var booking = await _bookingCollection.Find(x => x.Passengers.Any(p => p.PassengerId == passengerId)).FirstOrDefaultAsync();

            if (booking == null)
                return null;

            return booking.PnrNumber;
        }

        private async Task<string> GenerateUniquePnrAsync()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();

            string pnr;
            bool exists;

            do
            {
                pnr = new string(Enumerable.Repeat(chars, 6)
                    .Select(s => s[random.Next(s.Length)]).ToArray());

                exists = await _bookingCollection
                    .Find(x => x.PnrNumber == pnr)
                    .AnyAsync();

            } while (exists);

            return pnr;
        }
    }
}
