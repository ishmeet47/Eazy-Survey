using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected int GetUserId()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null) throw new Exception("User id not found");

            return int.Parse(userId);
        }
    }
}