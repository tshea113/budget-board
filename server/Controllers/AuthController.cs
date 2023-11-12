using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MoneyMinder.Models;
using Supabase.Gotrue;

namespace MoneyMinder.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Supabase.Client _client;

        public AuthController(Supabase.Client client)
        {
            _client = client;
        }

        [HttpPost]
        public async Task<Session?> LoginAsync(UserDetails user)
        {
            var session = await _client.Auth.SignIn(user.Email, user.Password);
            return session;
        }

        [HttpPost]
        public bool Register()
        {
            return _client != null;
        }

        [HttpPost]
        public bool Logout()
        {
            return _client != null;
        }

    }
}
