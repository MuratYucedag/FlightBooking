using AutoMapper;
using FlightBooking.Entities;
using FlightBooking.Services.BookingServices;
using FlightBooking.Settings;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace FlightBooking.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CheckInController : Controller
    {
        private readonly IBookingService _bookingService;
        public CheckInController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        public async Task< IActionResult> Index(string id)
        {
            ViewBag.FlightNumber = TempData["FlightNumber"];
            ViewBag.DepartureTime = TempData["DepartureTime"];
            ViewBag.ArrivalTime = TempData["ArrivalTime"];
            //ViewBag.PassengerName = TempData["PassengerName"];
            //  var value=await _bookingCollection.FindAsync(x=>x.Passengers.)

            var passenger = await _bookingService.GetPassengerNameByIdAsync(id);

            ViewBag.Name = passenger.Name;
            ViewBag.Surname = passenger.Surname;
            return View();
        }
    }
}
