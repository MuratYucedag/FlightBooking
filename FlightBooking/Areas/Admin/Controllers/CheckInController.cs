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

        public async Task<IActionResult> Index(string id)
        {
            ViewBag.FlightNumber = TempData["FlightNumber"];
            ViewBag.DepartureTime = TempData["DepartureTime"];
            ViewBag.ArrivalTime = TempData["ArrivalTime"];

            var passenger = await _bookingService.GetPassengerNameByIdAsync(id);
            var pnrNumber = await _bookingService.GetPnrByPassengerIdAsync(id);
            var gate = await _bookingService.GetGateByPassengerIdAsync(id);

            ViewBag.Name = passenger.Name;
            ViewBag.Surname = passenger.Surname;
            ViewBag.PnrNumber= pnrNumber;
            ViewBag.Gate= gate;
            return View();
        }

        public async Task<IActionResult> Index()
        {
            return RedirectToAction("");
        }
    }
}
