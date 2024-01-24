using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Controllers
{
    public class AccountController : BaseController
    {
        // api/account/login
        [HttpPost("login")]
        public async Task<IActionResult> Login()
        {
            throw new NotImplementedException();
        }

        // api/account/register
        [HttpPost("register")]
        public async Task<IActionResult> Register()
        {
            throw new NotImplementedException();
        }

        private string CreateJWT(User user)
        {
            throw new NotImplementedException();
        }

    }
}
