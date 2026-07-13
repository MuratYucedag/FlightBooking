namespace FlightBooking.Dtos.AgentDtos
{
    public class AgentResponseDto
    {
        public bool IsSuccess { get; set; }
        public string Response { get; set; }
        public string Model { get; set; }
        public DateTime ResponseTime { get; set; }
        public string Intent { get; set; }
    }
}
