using FlightBooking.Entities;
using FlightBooking.MachineLearningModels;
using FlightBooking.MachineLearningRegressionModels;
using FlightBooking.Settings;
using MongoDB.Driver;

namespace FlightBooking.Services.MachineLearningServices
{
    public class MongoFlightDataService
    {
        private readonly IMongoCollection<FlightRawData> _collection;
        public MongoFlightDataService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _collection = database.GetCollection<FlightRawData>(settings.FlightDemandHistoryCollection);
        }
        public async Task<List<FlightRawData>> GetAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<List<FlightData>> ConvertToMlDataAsync()
        {
            var rawData = await GetAllAsync();

            var mlData = rawData.Select(x => new FlightData
            {
                Month = DateTime.Parse(x.FlightDate).Month,

                DayOfWeek = (float)DateTime.Parse(x.FlightDate).DayOfWeek,

                FlightType = x.FlightType == "Morning" ? 0 : 1,

                IsFull = x.PassengerCount >= x.Capacity * 0.9
            }).ToList();

            return mlData;
        }

        public async Task<List<FlightRegressionData>> ConvertToRegressionDataAsync()
        {
            var rawData = await GetAllAsync();

            var regressionData = rawData.Select(x => new FlightRegressionData
            {
                Month = DateTime.Parse(x.FlightDate).Month,

                DayOfWeek = (float)DateTime.Parse(x.FlightDate).DayOfWeek,

                FlightType = x.FlightType == "Morning" ? 0 : 1,

                PassengerCount = x.PassengerCount
            }).ToList();

            return regressionData;
        }
    }
}
