using BudgetBoard.Database.Data;
using BudgetBoard.Database.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetBoard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserDataContext _userDataContext;
        public UserController(UserDataContext context)
        {
            _userDataContext = context;
        }

        private IActionResult CreateUser(string uid)
        {
            var newUser = new User
            {
                Uid = uid,
            };

            _userDataContext.Users.Add(newUser);
            _userDataContext.SaveChanges();

            return Ok();
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetUser()
        {
            string uid;
            try
            {
                uid = User.Claims.Single(c => c.Type == "id").Value;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            User? user = _userDataContext.Users.FirstOrDefault(x => x.Uid == uid);

            if (user == null)
            {
                // Push the new user to the db
                CreateUser(uid);

                // We need to throw an error if the user isn't pushed to the db correctly
                try
                {
                    user = _userDataContext.Users.Single(x => x.Uid == uid);
                    return Ok(user);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else
            {
                return Ok(user);
            }
        }
    }
}
