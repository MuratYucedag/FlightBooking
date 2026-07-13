namespace FlightBooking.AgentServices.IntentDetectors
{
    public class TravelIntentDetector:IIntentDetector
    {
        public TravelIntent Detect(string prompt)
        {
            if (string.IsNullOrWhiteSpace(prompt))
                return TravelIntent.Unknown;

            prompt = prompt.ToLower();

            if (prompt.Contains("restoran") ||
                prompt.Contains("yemek") ||
                prompt.Contains("hamburger") ||
                prompt.Contains("pizza") ||
                prompt.Contains("kahvaltı"))
            {
                return TravelIntent.Restaurant;
            }

            if (prompt.Contains("hava") ||
                prompt.Contains("yağmur") ||
                prompt.Contains("sıcaklık") ||
                prompt.Contains("hava durumu"))
            {
                return TravelIntent.Weather;
            }

            if (prompt.Contains("otel") ||
                prompt.Contains("konaklama"))
            {
                return TravelIntent.Hotel;
            }

            if (prompt.Contains("ulaşım") ||
                prompt.Contains("metro") ||
                prompt.Contains("otobüs") ||
                prompt.Contains("taksi") ||
                prompt.Contains("havalimanı") ||
                prompt.Contains("havaalanı"))
            {
                return TravelIntent.Transportation;
            }

            if (prompt.Contains("kur") ||
                prompt.Contains("döviz") ||
                prompt.Contains("euro") ||
                prompt.Contains("pound") ||
                prompt.Contains("dolar"))
            {
                return TravelIntent.Currency;
            }

            if (prompt.Contains("gezi planı") ||
                prompt.Contains("rota") ||
                prompt.Contains("itinerary") ||
                prompt.Contains("planla"))
            {
                return TravelIntent.Itinerary;
            }

            if (prompt.Contains("gezilecek") ||
                prompt.Contains("müze") ||
                prompt.Contains("meydan") ||
                prompt.Contains("old town") ||
                prompt.Contains("turistik"))
            {
                return TravelIntent.Attraction;
            }

            return TravelIntent.Unknown;
        }
    }
}
