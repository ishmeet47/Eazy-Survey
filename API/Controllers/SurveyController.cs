using API.Models;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class SurveyController : ControllerBase
{
    private readonly ISurveyRepository _repository;

    public SurveyController(ISurveyRepository repository)
    {
        _repository = repository;
    }

    [HttpPost("create")]
    public async Task<ActionResult<Survey>> CreateSurvey([FromBody] SurveyRequest request)
    {
        var survey = await _repository.CreateSurvey(request.Title, request.DueDate);
        if (survey == null) return BadRequest("Failed to create survey.");

        return CreatedAtAction(nameof(GetSurvey), new { id = survey.Id }, survey);
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
        await _repository.DeleteSurvey(id);
        return NoContent();
    }
}

public class SurveyRequest
{
    public string Title { get; set; }
    public DateTime? DueDate { get; set; }
}
