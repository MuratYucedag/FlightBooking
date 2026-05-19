namespace FlightBooking.Dtos.NoShowDtos
{
    public class OverbookingDashboardDto
    {
        public List<OverbookingRecommendationResult> Recommendations { get; set; }
        public double AverageNoShowRate { get; set; }
        public string MostRiskySlot { get; set; }
        public string MostStableSlot { get; set; }
        public double SuggestedOverbookingRate { get; set; }
        public int TotalFlightCount { get; set; }
        public int TotalPassengerCount { get; set; }
        public List<string> AiInsights { get; set; }
    }
}
