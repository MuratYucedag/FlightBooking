using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FlightBooking.MachineLearningModels
{
    public class FlightRawData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string Id { get; set; }

        [BsonElement("route")]
        public string Route { get; set; }

        [BsonElement("flightDate")]
        public string FlightDate { get; set; }

        [BsonElement("flightType")]
        public string FlightType { get; set; }

        [BsonElement("passengerCount")]
        public int PassengerCount { get; set; }

        [BsonElement("capacity")]
        public int Capacity { get; set; }
    }
}
