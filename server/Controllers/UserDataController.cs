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

        private IActionResult CreateUser(UserDetails user)
        {
            var newUser = new User
            {
                Uid = user.Uid,
            };

            _userDataContext.Users.Add(newUser);
            _userDataContext.SaveChanges();

            return Ok();
        }

        [HttpPost]
        [Authorize]
        public IActionResult GetUser([FromBody] UserDetails reqUser)
        {
            var user = _userDataContext.Users.FirstOrDefault(x => x.Uid == reqUser.Uid);

            if (user == null)
            {
                var userDetails = new UserDetails { Uid = reqUser.Uid };

                // Push the new user to the db
                CreateUser(userDetails);

                // We need to throw an error if the user isn't pushed to the db correctly
                user = _userDataContext.Users.First(x => x.Uid == reqUser.Uid);
                if (user == null)
                {
                    return BadRequest("There was an issue creating a new user!");
                }
                return Ok(userDetails);
            }

            return Ok(user);

        }
    }
}
