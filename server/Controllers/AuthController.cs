using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MoneyMinder.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public AuthController()
        {
        }

        [HttpGet]
        [Authorize]
        public IActionResult AuthTest()
        {
            return Ok("bongus");
        }

        [HttpGet]
        public IActionResult Test()
        {
            return Ok("bingus");
        }
    }
}