namespace FlightBooking.Dtos.OverBookingDtos
{
    public class OverbookingForecastResultDto
    {
        public string FlightDate { get; set; }
        public string FlightSlot { get; set; }
        public string AircraftType { get; set; }
        public int Capacity { get; set; }
        public int PredictedNoShow { get; set; }
        public int RecommendedMaxSale { get; set; }
        public int ExtraSeatCount { get; set; }
        public string RiskLevel { get; set; }
        public double EstimatedRevenue { get; set; }
    }
}
