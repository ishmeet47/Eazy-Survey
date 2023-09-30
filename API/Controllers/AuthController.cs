using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    // In reality, you'd fetch this from a database.
    private static List<User> Users = new List<User>
    {
        new User { Id = 1, Type = "ADMIN", Username = "administrator", Password = "adminpassword" },
        new User { Id = 2, Type = "USER", Username = "user1", Password = "userpassword" }
    };

    [HttpPost("login")]
    public IActionResult Login(User userToLogin)
    {
        var user = Users.FirstOrDefault(u => u.Username == userToLogin.Username && u.Password == userToLogin.Password);
        if (user == null)
        {
            return BadRequest("Invalid credentials");
        }
        return Ok(user);  // In a real-world application, you'd return a JWT or similar authentication token.
    }
}

}

