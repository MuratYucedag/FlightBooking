namespace FlightBooking.Dtos.MachineLearningOverbookingDtos
{
    public class NoShowPredictionData
    {
        public float Month { get; set; }
        public float DayOfWeek { get; set; }
        public float FlightSlot { get; set; }
        public float Capacity { get; set; }
        public float SoldTickets { get; set; }
        public float OnlineCheckedIn { get; set; }
        public float AirportCheckedIn { get; set; }
        public float MissedConnection { get; set; }
        public float CancelledPassenger { get; set; }
        public float NoShowPassenger { get; set; }
    }
}
