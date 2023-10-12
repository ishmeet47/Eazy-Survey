using System.Data.Common;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserAnswerController : ControllerBase
    {
        private readonly ISurveyRepository _repository;

        public UserAnswerController(ISurveyRepository repository)
        {
            _repository = repository;
        }

        // find all questions with a survey Id equal to the input survey Id
        [HttpGet("getquestion/{surveyId}")]
        public async Task<IActionResult> GetAllQuestions (int surveyId){
            var question = await _repository.GetAllQuestionOfSurvey(surveyId);
            
            return Ok(question);
        }

        // temperary add question to existing survey function
        [HttpPut("addquestion/{surveyId}")]
        public async Task<IActionResult> AddQuestionToSurvey(int surveyId, string questionText, List<string> options){
            var new_question = await _repository.CreateSurveyQuestion(surveyId, questionText, options);

            return Ok(new_question);
        }

        [HttpGet("getoptions/{questionId}")]
        public async Task<IActionResult> GetAllOptions(int questionId){
            var options = await _repository.GetAnswerOptions(questionId);

            return Ok(options);
        }

        [HttpPost("answerQuestion")]
        public async Task<IActionResult> AnswerQuestion (int userId, int optionId){
            var ans = await _repository.CreateSurveyAnswer(userId, optionId);
            return Ok();
        }


        // probably not working
        [HttpPost("submitsurvey")]
        public async Task<IActionResult> SubmitSurvey(int userId, int surveyId){
            var result = await _repository.SubmitSurvey(userId, surveyId);
            return Ok(result);
        }

        [HttpGet("getmysurvey/{userId}")]
        public async Task<IActionResult> GetMySurvey(int userId){
            var my_surveys = await _repository.GetAllowedSurveys(userId);
            return Ok(my_surveys);
        }


        [HttpGet("getmygroup/{userId}")]
        public async Task<int[]> GetMyGroup(int userId){
            var my_group = await _repository.GetAllMyGroups(userId);
            List<int> groups = new List<int>();
            foreach(var group in my_group){
                groups.Add(group.GroupId);
            }
            return groups.ToArray();
        }
    }
}
