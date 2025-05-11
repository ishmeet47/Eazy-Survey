using API.Models;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models.Requests;
using static API.Models.Requests.ExtendedSurveyRequest.QuestionWithOptions;

[Route("[controller]")]
[ApiController]
public class SurveyController : ControllerBase
{
    private readonly ISurveyRepository _repository;

    public SurveyController(ISurveyRepository repository)
    {
        _repository = repository;
    }

    // [HttpPost("create")]
    // public async Task<ActionResult<Survey>> CreateSurvey([FromBody] ExtendedSurveyRequest request)
    // {

    //     if (!ModelState.IsValid)
    //     {
    //         return BadRequest(ModelState);
    //     }
    //     var questions = request.QuestionsWithOptions.Select(q => (q.QuestionText, q.Options)).ToList();

    //     var survey = await _repository.CreateSurvey(request.Title, request.DueDate, questions, request.UserGroupIds, request.Description);
    //     if (survey == null) return BadRequest("Failed to create survey.");

    //     return CreatedAtAction(nameof(GetSurvey), new { id = survey.Id }, survey);
    // }

    [HttpPost("create")]
    public async Task<ActionResult<Survey>> CreateSurvey([FromBody] ExtendedSurveyRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState); // You can simplify the logging if needed.
        }

        var questions = request.QuestionsWithOptions.Select(q =>
      (
          q.Heading,
          q.Id, // This is the questionId
          q.Options.Select(o => new Option { Label = o.Label }).ToList()
      )
  ).ToList();


        var survey = await _repository.CreateSurvey(
            request.Title,
            request.DueDate,
            questions,
            request.UserGroupIds,
            request.Description
        );

        if (survey == null)
            return BadRequest("Failed to create survey.");

        return CreatedAtAction(nameof(GetSurvey), new { id = survey.Id }, survey);
    }




    // [HttpPut("publishsurvey/{id}")]
    // public async Task<IActionResult> PublishSurvey(int id)
    // {
    //     var success = await _repository.PublishSurvey(id);
    //     if (success) return NoContent();
    //     else return NotFound("Survey not found or already published.");
    // }

    [HttpGet("getsurvey/{id}")]
    public async Task<ActionResult<Survey>> GetSurvey(int id)
    {
        var survey = await _repository.GetSurvey(id);
        if (survey == null) return NotFound();

        return survey;
    }

    [HttpGet("getsurveys")]
    public async Task<ActionResult<IEnumerable<Survey>>> GetSurveys()
    {
        var surveys = await _repository.GetSurveys();
        return Ok(surveys);
    }


    [HttpPut("assign/{surveyId}")]
    public async Task<IActionResult> AssignSurveyToGroups(int surveyId, [FromBody] AssignSurveyRequest request)
    {
        var success = await _repository.AssignSurveyToGroups(surveyId, request.GroupIds);
        if (success) return NoContent();
        else return NotFound("Survey not found or already published.");
    }

    [HttpPut("updatesurvey/{id}")]
    public async Task<IActionResult> UpdateSurvey(int id, [FromBody] ExtendedSurveyRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != request.Id)
        {
            return BadRequest("Mismatched survey ID.");
        }

        var questions = request.QuestionsWithOptions.Select(q =>
            (
                q.Heading,
                q.Id,
                q.Options
            )).ToList();

        var survey = await _repository.UpdateSurvey(
            id,
            request.Title,
            request.DueDate,
            request.Description,
            questions,
            request.UserGroupIds
        );

        if (survey == null)
        {
            return NotFound("Survey not found or already published.");
        }

        // If you decide to send back the entire survey
        return Ok(survey);

        // Or if you decide to send a success message
        // return Ok(new { message = "Survey updated successfully." });
    }




    [HttpPut("publish/{surveyId}")]
    public async Task<IActionResult> PublishSurvey(int surveyId)
    {
        if (string.IsNullOrEmpty(surveyId.ToString()))
        {
            return BadRequest(new { success = false, message = "SurveyId is required" });
        }
        bool result = await _repository.PublishSurvey(surveyId);
        if (result)
        {
            return Ok(new { success = true, message = "Survey published successfully" });
        }
        return NotFound(new { success = false, message = "Survey not found" });
    }



    [HttpDelete("deletesurvey/{id}")]
    public async Task<IActionResult> DeleteSurvey(int id)
    {
        var success = await _repository.DeleteSurvey(id);
        if (success)
            return NoContent();
        else
            return NotFound("Survey not found.");
    }



    [HttpPost("getAnswersByOptionIds")]
    public async Task<ActionResult<IEnumerable<OptionCount>>> GetAnswersByOptionIds([FromBody] List<int> optionIds)
    {
        if (optionIds == null || optionIds.Count == 0)
        {
            return BadRequest("Option IDs are required.");
        }

        var results = await _repository.GetAnswerCountsByOptionIds(optionIds);
        return Ok(results);
    }



    [HttpPost("getUsersByGroupIds")]
    public async Task<ActionResult<IEnumerable<OptionCount>>> getUsersByGroupIds([FromBody] List<int> groupIds)
    {
        // if (groupIds == null || groupIds.Count == 0)
        // {
        //     return BadRequest("Group IDs are required.");
        // }

        var results = await _repository.getUsersByGroupIds(groupIds);
        return Ok(results);
    }


    public class OptionCount
    {
        public int OptionId { get; set; }
        public int Count { get; set; }
    }


    public class GroupCount
    {
        public int GroupId { get; set; }
        public int Count { get; set; }
    }



    // public class ExtendedSurveyRequest : SurveyRequest
    // {
    //     public List<(string QuestionText, List<string> Options)> QuestionsWithOptions { get; set; }
    // }

    public class AssignSurveyRequest
    {
        public List<int> GroupIds { get; set; }
    }

}

public class SurveyRequest
{
    public string Title { get; set; }
    public DateTime? DueDate { get; set; }
}
