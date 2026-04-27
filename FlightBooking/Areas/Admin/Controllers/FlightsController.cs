using FlightBooking.Dtos.FlightDtos;
using FlightBooking.Services.BookingServices;
using FlightBooking.Services.FlightServices;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooking.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class FlightsController : Controller
    {
        private readonly IFlightService _flightService;
        public FlightsController(IFlightService flightService)
        {
            _flightService = flightService;
        }
        public async Task<IActionResult> FlightList()
        {
            var values = await _flightService.GetAllFlightsAsync();
            return View(values);
        }

        [HttpGet]
        public IActionResult CreateFlight()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CreateFlight(CreateFlightDto createFlightDto)
        {
            await _flightService.CreateFlightAsync(createFlightDto);
            return RedirectToAction("FlightList");
        }

        public async Task<IActionResult> FlightDetail(string id)
        {
            var flight = await _flightService.GetFlightByIdAsync(id);
            var passengers = await _flightService.GetFlightDetailsWithPassengers(id);

            ViewBag.FlightNumber = flight?.FlightNumber ?? "—";
            ViewBag.AirlineCode = flight?.AirlineCode ?? "—";
            ViewBag.DepartureAirportCode = flight?.DepartureAirportCode ?? "—";
            ViewBag.ArrivalAirportCode = flight?.ArrivalAirportCode ?? "—";
            ViewBag.DepartureTime = flight?.DepartureTime;   // DateTime? olarak gider
            ViewBag.ArrivalTime = flight?.ArrivalTime;
            ViewBag.TotalSeats = flight?.TotalSeats ?? 0;
            ViewBag.Status = flight?.Status ?? "—";

            TempData["FlightNumber"] = flight.FlightNumber;
            TempData["DepartureTime"] = flight.DepartureTime;
            TempData["ArrivalTime"] = flight.ArrivalTime;

          //  var passenger = await _bookingService.GetPassengerNameByIdAsync(id);


            //TempData["PassengerName"] = passengers.Select(x => x.Name).FirstOrDefault();

            return View(passengers);
        }
    }
}
