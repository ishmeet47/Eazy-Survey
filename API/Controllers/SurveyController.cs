using API.Models;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models.Requests;

[Route("[controller]")]
[ApiController]
public class SurveyController : ControllerBase
{
    private readonly ISurveyRepository _repository;

    public SurveyController(ISurveyRepository repository)
    {
        _repository = repository;
    }

    [HttpPost("create")]
    public async Task<ActionResult<Survey>> CreateSurvey([FromBody] ExtendedSurveyRequest request)
    {
        var questions = request.QuestionsWithOptions.Select(q => (q.QuestionText, q.Options)).ToList();

        var survey = await _repository.CreateSurvey(request.Title, request.DueDate, questions, request.UserGroupIds);
        if (survey == null) return BadRequest("Failed to create survey.");

        return CreatedAtAction(nameof(GetSurvey), new { id = survey.Id }, survey);
    }




    [HttpPut("publishsurvey/{id}")]
    public async Task<IActionResult> PublishSurvey(int id)
    {
        var success = await _repository.PublishSurvey(id);
        if (success) return NoContent();
        else return NotFound("Survey not found or already published.");
    }

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
    public async Task<ActionResult<Survey>> UpdateSurvey(int id, [FromBody] SurveyRequest request)
    {
        var survey = await _repository.UpdateSurvey(id, request.Title, request.DueDate);
        if (survey == null) return NotFound("Survey not found.");

        return Ok(survey);
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
