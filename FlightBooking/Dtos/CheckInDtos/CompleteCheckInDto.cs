namespace FlightBooking.Dtos.CheckInDtos
{
    public class CompleteCheckInDto
    {
        public string PassengerId { get; set; }
        public string FlightId { get; set; }
        public string PnrNumber { get; set; }

        public string SeatNumber { get; set; }
        public int BaggageKg { get; set; }
        public string? MealType { get; set; }

        public List<string>? ExtraServices { get; set; }

        public decimal ExtraTotalPrice { get; set; }
    }
}
