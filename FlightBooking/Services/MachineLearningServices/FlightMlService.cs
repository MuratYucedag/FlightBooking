using FlightBooking.MachineLearningModels;
using Microsoft.ML;

namespace FlightBooking.Services.MachineLearningServices
{
    public class FlightMlService
    {
        private readonly MLContext _context;
        private ITransformer _model;

        public FlightMlService()
        {
            _context = new MLContext();
        }

        // 🎯 MODEL EĞİTME
        public void Train(List<FlightData> dataList)
        {
            var data = _context.Data.LoadFromEnumerable(dataList);

            var pipeline = _context.Transforms.Concatenate("Features",
                    nameof(FlightData.Month),
                    nameof(FlightData.DayOfWeek),
                    nameof(FlightData.FlightType))
                .Append(_context.BinaryClassification.Trainers.SdcaLogisticRegression(
                    labelColumnName: "IsFull",
                    featureColumnName: "Features"));

            _model = pipeline.Fit(data);
        }

        // 🔮 TAHMİN
        public FlightPrediction Predict(FlightData input)
        {
            var engine = _context.Model.CreatePredictionEngine<FlightData, FlightPrediction>(_model);

            return engine.Predict(input);
        }
    }
}
