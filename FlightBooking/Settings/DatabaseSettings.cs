namespace FlightBooking.Settings
{
    public class DatabaseSettings : IDatabaseSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        public string FlightCollectionName { get; set; }
        public string BookingCollectionName { get; set; }
        public string CheckInCollectionName { get; set; }
        public string FlightDemandHistoryCollection { get; set; }
        public string NoShowHistoryCollection { get; set; }
    }
}
