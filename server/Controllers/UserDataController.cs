using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyMinder.Data;
using MoneyMinder.Models;

namespace MoneyMinder.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserDataController : ControllerBase
    {
        private readonly UserDataContext _userDataContext;
        public UserDataController(UserDataContext context)
        {
            _userDataContext = context;
        }

        [HttpPost]
        [Authorize]
        public IActionResult CreateUser(UserDetails user)
        {
            var newUser = new User
            {
                Uid = user.Uid,
            };

            _userDataContext.Users.Add(newUser);
            _userDataContext.SaveChanges();

            return Ok();
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetUser(string uid)
        {
            var user = _userDataContext.Users.First(x => x.Uid == uid);

            if (user == null)
            {
                return BadRequest("User not found!");
            }

            return Ok(user);

        }
    }
}
