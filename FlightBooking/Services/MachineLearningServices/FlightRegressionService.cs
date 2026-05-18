using FlightBooking.MachineLearningRegressionModels;
using Microsoft.ML;

namespace FlightBooking.Services.MachineLearningServices
{
    public class FlightRegressionService
    {
        private readonly MLContext _context;
        private ITransformer _model;
        public FlightRegressionService()
        {
            _context = new MLContext();
        }

        public void Train(List<FlightRegressionData> dataList)
        {
            var data = _context.Data.LoadFromEnumerable(dataList);

            var pipeline = _context.Transforms.Concatenate("Features",
                    nameof(FlightRegressionData.Month),
                    nameof(FlightRegressionData.DayOfWeek),
                    nameof(FlightRegressionData.FlightType))
                .Append(_context.Regression.Trainers.FastTree(
                    labelColumnName: "PassengerCount",
                    featureColumnName: "Features"));

            _model = pipeline.Fit(data);
        }

        public FlightRegressionPrediction Predict(FlightRegressionData input)
        {
            var engine = _context.Model.CreatePredictionEngine
                <FlightRegressionData, FlightRegressionPrediction>(_model);

            return engine.Predict(input);
        }
    }
}
