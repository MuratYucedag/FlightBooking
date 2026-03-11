using Microsoft.AspNetCore.Mvc;

namespace FlightBooking.Controllers
{
    public class DefaultController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
