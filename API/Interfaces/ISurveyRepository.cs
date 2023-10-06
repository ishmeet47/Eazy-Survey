using API.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface ISurveyRepository
    {
        // Existing methods for Survey
        Task<Survey> CreateSurvey(
                string title,
                DateTime? dueDate,
                List<(string QuestionText, List<string> Options)> questionsWithOptions,
                List<int> userGroupIds);
        Task<Survey> GetSurvey(int id);
        Task<IEnumerable<Survey>> GetSurveys();
        Task<Survey> UpdateSurvey(int id, string title, DateTime? dueDate = null);
        Task<bool> DeleteSurvey(int id);
        Task<bool> PublishSurvey(int id);
        Task<bool> AssignSurveyToGroups(int surveyId, List<int> groupIds);

        // New methods for SurveyQuestion
        Task<SurveyQuestion> CreateSurveyQuestion(int surveyId, string questionText, List<string> options);
        Task<SurveyQuestion> GetSurveyQuestion(int questionId);
        Task<IEnumerable<SurveyQuestion>> GetSurveyQuestionsBySurveyId(int surveyId);
        Task<SurveyQuestion> UpdateSurveyQuestion(int questionId, string questionText, List<string> options = null);
        Task<bool> DeleteSurveyQuestion(int questionId);

        // New methods for SurveyAnswer
        Task<SurveyAnswer> CreateSurveyAnswer(int userId, int optionId);
        Task<SurveyAnswer> GetSurveyAnswer(int userId, int optionId);
        Task<IEnumerable<SurveyAnswer>> GetSurveyAnswersByUserId(int userId);
        Task<bool> DeleteSurveyAnswer(int userId, int optionId);
    }
}
