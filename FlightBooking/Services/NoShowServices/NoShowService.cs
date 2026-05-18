using FlightBooking.Entities;
using FlightBooking.Settings;
using MongoDB.Driver;

namespace FlightBooking.Services.NoShowServices
{
    public class NoShowService
    {
        private readonly IMongoCollection<NoShowHistory> _collection;
        public NoShowService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _collection = database.GetCollection<NoShowHistory>(settings.NoShowHistoryCollection);
        }
        public async Task<List<NoShowHistory>> GetAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Dictionary<string, double>> GetSlotBasedNoShowRatesAsync()
        {
            var data = await GetAllAsync();

            var result = data
                .GroupBy(x => x.FlightSlot).ToDictionary(
                    g => g.Key,
                    g => Math.Round((g.Sum(x => x.NoShowPassenger) * 100.0) / g.Sum(x => x.SoldTickets), 2));

            return result;
        }
    }
}
