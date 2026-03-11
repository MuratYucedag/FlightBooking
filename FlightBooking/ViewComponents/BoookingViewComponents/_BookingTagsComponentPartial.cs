using Microsoft.AspNetCore.Mvc;

namespace FlightBooking.ViewComponents.BoookingViewComponents
{
    public class _BookingTagsComponentPartial:ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
