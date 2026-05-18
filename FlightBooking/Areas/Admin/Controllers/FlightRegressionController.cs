using FlightBooking.MachineLearningRegressionModels;
using FlightBooking.Services.MachineLearningServices;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooking.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class FlightRegressionController : Controller
    {
        private readonly FlightRegressionService _regressionService;
        private readonly MongoFlightDataService _mongoService;
        private readonly FlightMlService _mlService;
        public FlightRegressionController(MongoFlightDataService mongoService, FlightMlService mlService, FlightRegressionService regressionService)
        {
            _mongoService = mongoService;
            _mlService = mlService;
            _regressionService = regressionService;
        }
        public async Task< IActionResult> TrainRegressionModel()
        {
            var regressionData = await _mongoService.ConvertToRegressionDataAsync();
            _regressionService.Train(regressionData);
            ViewBag.Message = "Regression modeli başarıyla eğitildi.";
            return View(); 
        }

        public IActionResult January2027Forecast()
        {
            var result = new List<string>();

            for (int day = 1; day <= 31; day++)
            {
                var date = new DateTime(2027, 1, day);

                // 🌅 Morning
                var morningInput = new FlightRegressionData
                {
                    Month = date.Month,
                    DayOfWeek = (float)date.DayOfWeek,
                    FlightType = 0
                };

                var morningPrediction = _regressionService.Predict(morningInput);

                // 🌙 Evening
                var eveningInput = new FlightRegressionData
                {
                    Month = date.Month,
                    DayOfWeek = (float)date.DayOfWeek,
                    FlightType = 1
                };

                var eveningPrediction = _regressionService.Predict(eveningInput);

                result.Add(
                    $"{date:dd.MM.yyyy} → Morning: {morningPrediction.Score:0} yolcu | Evening: {eveningPrediction.Score:0} yolcu");
            }

            return View(result);
        }
    }
}
