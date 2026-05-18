using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FlightBooking.Entities
{
    public class NoShowHistory
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string Id { get; set; }

        [BsonElement("route")]
        public string Route { get; set; }

        [BsonElement("flightDate")]
        public string FlightDate { get; set; }

        [BsonElement("flightSlot")]
        public string FlightSlot { get; set; }

        [BsonElement("aircraftType")]
        public string AircraftType { get; set; }

        // ✈️ Uçak kapasitesi
        [BsonElement("capacity")]
        public int Capacity { get; set; }

        // 🎫 Satılan toplam bilet
        [BsonElement("soldTickets")]
        public int SoldTickets { get; set; }

        // 💻 Online check-in yapan yolcu
        [BsonElement("onlineCheckedIn")]
        public int OnlineCheckedIn { get; set; }

        // 🏢 Havalimanında check-in yapan yolcu
        [BsonElement("airportCheckedIn")]
        public int AirportCheckedIn { get; set; }

        // 🛫 Gerçekten uçağa binen yolcu
        [BsonElement("boardedPassenger")]
        public int BoardedPassenger { get; set; }

        // ❌ Hiç gelmeyen yolcu
        [BsonElement("noShowPassenger")]
        public int NoShowPassenger { get; set; }

        // ⚠️ Online check-in yapıp gelmeyen
        [BsonElement("onlineCheckInNoShow")]
        public int OnlineCheckInNoShow { get; set; }

        // 🔄 Aktarmayı kaçıran yolcu
        [BsonElement("missedConnection")]
        public int MissedConnection { get; set; }

        // 🚫 Sonradan rezervasyon iptal eden
        [BsonElement("cancelledPassenger")]
        public int CancelledPassenger { get; set; }
    }
}
