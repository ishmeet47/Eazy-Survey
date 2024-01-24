using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Interfaces;
using System;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("group")]
    public class GroupController : ControllerBase
    {
        private readonly IGroupService _groupService;

        public GroupController(IGroupService groupService)
        {
            _groupService = groupService ?? throw new ArgumentNullException(nameof(groupService));
        }

        [HttpGet("getgroups")]
        public async Task<IActionResult> GetAllGroups()
        {
            var groups = await _groupService.GetGroupsAsync();
            return Ok(groups);
        }

        [HttpPost("creategroup")]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupDto request)
        {
            if (string.IsNullOrEmpty(request.GroupName))
            {
                return BadRequest("Group name cannot be empty.");
            }

            var result = await _groupService.CreateGroupAsync(request.GroupName);
            return result ? Ok(new { Message = "Group created successfully." }) : BadRequest("Error creating group.");
        }


        [HttpDelete("deletegroup/{groupId}")]
        public async Task<IActionResult> DeleteGroup(int groupId)
        {
            try
            {
                await _groupService.DeleteGroupAndAssociations(groupId);
                return Ok(new { message = "Group deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Failed to delete group. Reason: {ex.Message}" });
            }
        }


        [HttpGet("getgroupsbysurvey/{surveyId}")]
        public async Task<IActionResult> GetGroupsBySurveyId(int surveyId)
        {
            var groups = await _groupService.GetGroupsBySurveyIdAsync(surveyId);
            if (groups == null || !groups.Any())
            {
                return NotFound("No groups found associated with the provided survey ID.");
            }
            return Ok(groups);
        }




        // Add other necessary endpoints as needed
    }
}
