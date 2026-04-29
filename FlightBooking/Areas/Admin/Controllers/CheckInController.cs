using AutoMapper;
using FlightBooking.Dtos.CheckInDtos;
using FlightBooking.Entities;
using FlightBooking.Services.BookingServices;
using FlightBooking.Services.CheckInServices;
using FlightBooking.Settings;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace FlightBooking.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CheckInController : Controller
    {
        private readonly IBookingService _bookingService;
        private readonly ICheckInService _checkInService;
        public CheckInController(IBookingService bookingService, ICheckInService checkInService)
        {
            _bookingService = bookingService;
            _checkInService = checkInService;
        }

        //public async Task<IActionResult> Index(string id)
        //{
        //    ViewBag.FlightNumber = TempData["FlightNumber"];
        //    ViewBag.DepartureTime = TempData["DepartureTime"];
        //    ViewBag.ArrivalTime = TempData["ArrivalTime"];

        //    var passenger = await _bookingService.GetPassengerNameByIdAsync(id);
        //    var pnrNumber = await _bookingService.GetPnrByPassengerIdAsync(id);
        //    var gate = await _bookingService.GetGateByPassengerIdAsync(id);

        //    ViewBag.Name = passenger.Name;
        //    ViewBag.Surname = passenger.Surname;
        //    ViewBag.PnrNumber = pnrNumber;
        //    ViewBag.Gate = gate;
        //    return View();
        //}

        public async Task<IActionResult> Index(string id)
        {
            ViewBag.FlightNumber = TempData["FlightNumber"];
            ViewBag.DepartureTime = TempData["DepartureTime"];
            ViewBag.ArrivalTime = TempData["ArrivalTime"];
            ViewBag.AirlineCode = TempData["AirlineCode"];          // banner'da kullanılıyor
            ViewBag.DepartureAirportCode = TempData["DepartureAirportCode"];
            ViewBag.DepartureAirportName = TempData["DepartureAirportName"];
            ViewBag.ArrivalAirportCode = TempData["ArrivalAirportCode"];
            ViewBag.ArrivalAirportName = TempData["ArrivalAirportName"];
            ViewBag.BasePrice = TempData["BasePrice"];
            ViewBag.Currency = TempData["Currency"];

            var passenger = await _bookingService.GetPassengerNameByIdAsync(id);
            var pnrNumber = await _bookingService.GetPnrByPassengerIdAsync(id);
            var gate = await _bookingService.GetGateByPassengerIdAsync(id);
            //var flightId = await _bookingService.GetFlightIdByPassengerIdAsync(id); // 🔥 yeni metod

            ViewBag.Name = passenger.Name;
            ViewBag.Surname = passenger.Surname;
            ViewBag.PassengerName = passenger.Name + " " + passenger.Surname;
            ViewBag.PnrNumber = pnrNumber;
            ViewBag.Pnr = pnrNumber;   // modal'da @ViewBag.Pnr kullanılıyor
            ViewBag.Gate = gate;

            // 🔥 Form için gerekli — hidden field olarak view'a taşınacak
            ViewBag.PassengerId = id;
            ViewBag.FlightId = "69c394a7ca107d148d4d4e10";

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index(CompleteCheckInDto completeCheckInDto)
        {
            await _checkInService.CompleteCheckInAsync(completeCheckInDto);
            return RedirectToAction("Test");
        }
    }
}
