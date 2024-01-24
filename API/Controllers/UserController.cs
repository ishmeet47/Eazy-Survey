using API.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("user")]  // Typically prefix routes with 'api'
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }

        // POST: api/user
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.CreateUserAsync(request.Username, request.Password, request.GroupIds);

            if (result)
            {
                return Ok(new { Message = "User created successfully." });
            }
            return BadRequest("Error creating user.");
        }

        // GET: api/user
        [HttpGet("getusers")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetUsersAsync();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // just to diagnose if there's an issue here
            }

            return Ok(users);
        }

        // [HttpGet("getusers")]
        // public async Task<IActionResult> GetUsers()
        // {
        //     var userDtos = await _userService.GetUsersAsync();
        //     return Ok(userDtos);
        // }

        // POST: api/user/add
        [HttpPost("add")]
        public async Task<IActionResult> AddUser([FromBody] CreateUserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.AddUserAsync(request.Username, request.Password, request.GroupIds);
            return result ? Ok(new { Message = "User added successfully." }) : BadRequest("Error adding user.");
        }

        // DELETE: api/user/{id}
        [HttpDelete("deleteuser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            return result ? Ok(new { Message = "User deleted successfully." }) : BadRequest("Error deleting user.");
        }

        // PUT: api/user/{id}
        [HttpPut("updateuser/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.GroupIds == null)
            {
                return BadRequest("The GroupIds field is required.");
            }

            var result = await _userService.UpdateUserAsync(id, request);
            return result ? Ok(new { Message = "User updated successfully." }) : BadRequest("Error updating user.");
        }






        // POST: api/user/group
        [HttpPost("addusertogroups")]
        public async Task<IActionResult> AddUserToGroups([FromBody] AddUserToGroupRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.AddUserToGroupsAsync(request.UserId, request.GroupIds);
            return result ? Ok(new { Message = "User added to groups successfully." }) : BadRequest("Error adding user to groups.");
        }


        // GET: api/user/groups
        [HttpGet("groups")]
        public async Task<IActionResult> GetGroups()
        {
            var groups = await _userService.GetGroupsAsync();
            return Ok(groups);
        }

        // POST: api/user/groups/create
        [HttpPost("groups/create")]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.CreateGroupAsync(request.Name);
            return result ? Ok(new { Message = "Group created successfully." }) : BadRequest("Error creating group.");
        }
    }
}
