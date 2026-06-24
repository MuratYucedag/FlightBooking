using FlightBooking.AgentServices;
using FlightBooking.Dtos.AgentDtos;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooking.Controllers
{
    public class AgentController : Controller
    {
        private readonly ITravelAgentService _travelAgentService;
        public AgentController(ITravelAgentService travelAgentService)
        {
            _travelAgentService = travelAgentService;
        }

        [HttpGet]
        public IActionResult AskAgent()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> AskAgent(AgentPromptRequestDto request)
        {
            var result = await _travelAgentService.AskAgentAsync(request.Prompt);
            return Content(result);
        }
    }
}
