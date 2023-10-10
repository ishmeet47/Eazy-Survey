using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest loginRequest)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == loginRequest.Username);

            if (user == null || !VerifyPassword(loginRequest.Password, user.PasswordKey, user.Password))
            {
                return BadRequest("Invalid credentials"); // Generalize the error message
            }

            var token = GenerateJwtToken(user);

            // Retrieve the group IDs associated with the user.
            var groupIds = _context.UserGroups
                                   .Where(ug => ug.UserId == user.Id)
                                   .Select(ug => ug.GroupId)
                                   .ToList();

            return Ok(new { token, UserType = user.UserType, GroupIds = groupIds });
        }

        private bool VerifyPassword(string password, byte[] storedSalt, byte[] storedHash)
        {
            var computedHash = HashPassword(password, storedSalt);
            return computedHash.SequenceEqual(storedHash);
        }

        private byte[] HashPassword(string password, byte[] salt)
        {
            using var hmac = new HMACSHA512(salt);
            return hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration.GetSection("AppSettings:Secret").Value);
            var currentTime = DateTime.UtcNow;

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.UserType)
                }),
                NotBefore = currentTime.AddMinutes(-5), // Set to 5 minutes before current time
                Expires = currentTime.AddHours(1), // Token expiry set to 1 hour from current time
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };

            // Logging (Optional) - If you have a logging setup, you can uncomment and use this
            // Console.WriteLine($"Token Generation - NotBefore: {tokenDescriptor.NotBefore}, Expires: {tokenDescriptor.Expires}");

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
