using FlightBooking.Dtos.MachineLearningOverbookingDtos;
using FlightBooking.Dtos.OverBookingDtos;
using FlightBooking.Entities;
using FlightBooking.Settings;
using Microsoft.ML;
using MongoDB.Driver;

namespace FlightBooking.Services.OverBookingNoShowServices
{
    public class NoShowPredictionService
    {
        private readonly IMongoCollection<NoShowHistory> _noShowCollection;
        private readonly MLContext _mlContext;

        public NoShowPredictionService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _noShowCollection = database.GetCollection<NoShowHistory>(settings.NoShowHistoryCollection);
            _mlContext = new MLContext();
        }

        public async Task<List<OverbookingForecastResultDto>> PredictJanuary2027Async()
        {
            var historicalData = await _noShowCollection.Find(_ => true).ToListAsync();

            // ML Training Data
            var trainingData = historicalData.Select(x => new NoShowPredictionData
            {
                Month = DateTime.Parse(x.FlightDate).Month,
                DayOfWeek = (float)DateTime.Parse(x.FlightDate).DayOfWeek,
                FlightSlot = ConvertFlightSlotToNumber(x.FlightSlot),
                Capacity = x.Capacity,
                SoldTickets = x.SoldTickets,
                OnlineCheckedIn = x.OnlineCheckedIn,
                AirportCheckedIn = x.AirportCheckedIn,
                MissedConnection = x.MissedConnection,
                CancelledPassenger = x.CancelledPassenger,
                NoShowPassenger = x.NoShowPassenger
            }).ToList();

            var dataView = _mlContext.Data.LoadFromEnumerable(trainingData);

            var pipeline = _mlContext.Transforms.Concatenate(
                        "Features",
                        nameof(NoShowPredictionData.Month),
                        nameof(NoShowPredictionData.DayOfWeek),
                        nameof(NoShowPredictionData.FlightSlot),
                        nameof(NoShowPredictionData.Capacity),
                        nameof(NoShowPredictionData.SoldTickets),
                        nameof(NoShowPredictionData.OnlineCheckedIn),
                        nameof(NoShowPredictionData.AirportCheckedIn),
                        nameof(NoShowPredictionData.MissedConnection),
                        nameof(NoShowPredictionData.CancelledPassenger))
                    .Append(_mlContext.Regression.Trainers.FastTree(labelColumnName: "NoShowPassenger", featureColumnName: "Features"));

            var model = pipeline.Fit(dataView);

            var predictionEngine = _mlContext.Model.CreatePredictionEngine<NoShowPredictionData, NoShowPredictionResult>(model);

            var results = new List<OverbookingForecastResultDto>();

            // Gerçek slot template'leri DB’den alınır
            var slotTemplates = historicalData.GroupBy(x => x.FlightSlot).Select(g => g.First()).ToList();

            for (int day = 1; day <= 31; day++)
            {
                var date = new DateTime(2027, 1, day);

                foreach (var slot in slotTemplates)
                {
                    var sample = new NoShowPredictionData
                    {
                        Month = 1,
                        DayOfWeek = (float)date.DayOfWeek,
                        FlightSlot = ConvertFlightSlotToNumber(slot.FlightSlot),
                        Capacity = slot.Capacity,
                        // Simüle edilen satış
                        SoldTickets = slot.Capacity,
                        // Ortalama check-in davranışı
                        OnlineCheckedIn = slot.Capacity * 0.70f,
                        AirportCheckedIn = slot.Capacity * 0.20f,
                        MissedConnection = 2,
                        CancelledPassenger = 1
                    };

                    var prediction = predictionEngine.Predict(sample);
                    var predictedNoShow = (int)Math.Round(prediction.Score);

                    // Negatif prediction koruması
                    if (predictedNoShow < 0)
                        predictedNoShow = 0;

                    var recommendedMaxSale = slot.Capacity + predictedNoShow;

                    var riskLevel = predictedNoShow >= 15 ? "High" : predictedNoShow >= 10 ? "Medium" : "Low";

                    var estimatedRevenue = predictedNoShow * 120;

                    results.Add(
                        new OverbookingForecastResultDto
                        {
                            FlightDate = date.ToString("dd.MM.yyyy"),
                            FlightSlot = slot.FlightSlot,
                            AircraftType = slot.AircraftType,
                            Capacity = slot.Capacity,
                            PredictedNoShow = predictedNoShow,
                            RecommendedMaxSale = recommendedMaxSale,
                            ExtraSeatCount = predictedNoShow,
                            RiskLevel = riskLevel,
                            EstimatedRevenue = estimatedRevenue
                        });
                }
            }

            return results;
        }

        private float ConvertFlightSlotToNumber(string slot)
        {
            return slot switch
            {
                "Morning-1" => 1,
                "Morning-2" => 2,
                "Evening-1" => 3,
                "Evening-2" => 4,
                _ => 0
            };
        }
    }
}