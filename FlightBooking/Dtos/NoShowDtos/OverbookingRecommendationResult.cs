namespace FlightBooking.Dtos.NoShowDtos
{
    public class OverbookingRecommendationResult
    {
        public string FlightDate { get; set; }

        public string FlightSlot { get; set; }

        public int? ForecastPassengerCount { get; set; }
        public int ActualPassengerCount { get; set; }

        public int Capacity { get; set; }

        public double ExpectedNoShowRate { get; set; }

        public int ExpectedNoShowPassenger { get; set; }

        public int RecommendedMaxTicketSale { get; set; }

        public int ExtraSellableSeatCount { get; set; }

        public string RiskLevel { get; set; }

        public string Recommendation { get; set; }
    }
}
