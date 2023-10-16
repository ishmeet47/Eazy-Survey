using API.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static API.Models.Requests.ExtendedSurveyRequest.QuestionWithOptions;
using static SurveyController;

namespace API.Interfaces
{
  public interface ISurveyRepository
  {
    // Existing methods for Survey
    Task<Survey> CreateSurvey(
            string title,
            DateTime? dueDate,
            List<(string heading, int questionId, List<Option> Options)> questionsWithOptions,
            List<int> userGroupIds, string description);
    Task<Survey> GetSurvey(int id);
    Task<IEnumerable<Survey>> GetSurveys();
    Task<Survey> UpdateSurvey(
        int id,
        string title,
        DateTime? dueDate,
        string description,
        List<(string heading, int questionId, List<Option> Options)> questionsWithOptions,
        List<int> userGroupIds
    );
    Task<bool> DeleteSurvey(int id);
    Task<bool> PublishSurvey(int id);
    Task<bool> AssignSurveyToGroups(int surveyId, List<int> groupIds);

    // New methods for SurveyQuestion
    // Task<SurveyQuestion> CreateSurveyQuestion(int surveyId, string questionText, List<Option> Options);
    Task<SurveyQuestion> GetSurveyQuestion(int questionId);
    Task<IEnumerable<SurveyQuestion>> GetSurveyQuestionsBySurveyId(int surveyId);
    Task<SurveyQuestion> UpdateSurveyQuestion(int questionId, string heading, List<Option> Options = null);
    Task<bool> DeleteSurveyQuestion(int questionId);

    // New methods for SurveyAnswer
    Task<SurveyAnswer> CreateSurveyAnswer(int userId, int optionId);
    Task<SurveyAnswer> GetSurveyAnswer(int userId, int optionId);
    Task<IEnumerable<SurveyAnswer>> GetSurveyAnswersByUserId(int userId);
    Task<bool> DeleteSurveyAnswer(int userId, int optionId);


    Task<List<OptionCount>> GetAnswerCountsByOptionIds(List<int> optionIds);

    Task<IEnumerable<GroupCount>> getUsersByGroupIds(List<int> groupIds);

    // if all question are answered submit if not dont so return bool
    Task<IEnumerable<SurveyQuestion>> GetAllQuestionOfSurvey(int surveyId);
    Task<bool> SubmitSurvey(int userId, int surveyId);

    // New methods for SurveyQuestion
    Task<SurveyQuestion> CreateSurveyQuestion(int surveyId, string questionText, List<string> options);

    // Task<SurveyQuestion> GetSurveyQuestion(int questionId);
    // Task<IEnumerable<SurveyQuestion>> GetSurveyQuestionsBySurveyId(int surveyId);
    // Task<SurveyQuestion> UpdateSurveyQuestion(int questionId, string questionText, List<string> options = null);

    // Task<bool> DeleteSurveyQuestion(int questionId);

    // New methods for SurveyAnswer
    // Task<SurveyAnswer> CreateSurveyAnswer(int userId, int optionId);
    // Task<SurveyAnswer> GetSurveyAnswer(int userId, int optionId);
    // Task<IEnumerable<SurveyAnswer>> GetSurveyAnswersByUserId(int userId);
    // Task<bool> DeleteSurveyAnswer(int userId, int optionId);

    // Survey Option functions
    Task<IEnumerable<SurveyOption>> GetAnswerOptions(int QuestionId);
    Task<IEnumerable<Survey>> GetAllowedSurveys(int userId);
    Task<IEnumerable<UserGroup>> GetAllMyGroups(int userId);
    Task<IEnumerable<Survey>> GetAllSubmittedSurvey(int userId);
        //Task<IEnumerable<Survey>> GetAllGroupSurveys(UserGroup[] userGroups);
        //Task<IEnumerable<>>
    }
}
