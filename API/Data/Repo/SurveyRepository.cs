using API.Interfaces;
using API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using static API.Models.Requests.ExtendedSurveyRequest.QuestionWithOptions;
using static SurveyController;

namespace API.Data.Repo
{
    public class SurveyRepository : ISurveyRepository
    {
        public Task<Survey> CreateSurvey(string title, DateTime? dueDate, List<(string heading, int questionId, List<Option> Options)> questionsWithOptions, List<int> userGroupIds, string description)
        {
            throw new NotImplementedException();
        }


        public Task<Survey> GetSurvey(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Survey>> GetSurveys()
        {
            throw new NotImplementedException();
        }

        public Task<Survey> UpdateSurvey(int id, string title, DateTime? dueDate, string description, List<(string heading, int questionId, List<Option> Options)> questionsWithOptions, List<int> userGroupIds)
        {
            throw new NotImplementedException();
        }


        public Task<bool> DeleteSurvey(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> PublishSurvey(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> AssignSurveyToGroups(int surveyId, List<int> groupIds)
        {
            throw new NotImplementedException();
        }



        public Task<SurveyQuestion> CreateSurveyQuestion(int surveyId, string questionText, List<Option> options)
        {
            throw new NotImplementedException();
        }

        public Task<SurveyQuestion> GetSurveyQuestion(int questionId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<SurveyQuestion>> GetSurveyQuestionsBySurveyId(int surveyId)
        {
            throw new NotImplementedException();
        }

        public Task<SurveyQuestion> UpdateSurveyQuestion(int questionId, string heading, List<Option> options)
        {
            throw new NotImplementedException();
        }


        public Task<bool> DeleteSurveyQuestion(int questionId)
        {
            throw new NotImplementedException();
        }

        public Task<SurveyAnswer> CreateSurveyAnswer(int userId, int questionId)
        {
            throw new NotImplementedException();
        }

        public Task<SurveyAnswer> GetSurveyAnswer(int userId, int questionId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<SurveyAnswer>> GetSurveyAnswersByUserId(int userId)
        {
            throw new NotImplementedException();
        }


        public Task<bool> DeleteSurveyAnswer(int userId, int optionId)
        {
            throw new NotImplementedException();
        }



        public Task<List<OptionCount>> GetAnswerCountsByOptionIds(List<int> optionIds)
        {

            throw new NotImplementedException();

        }



        public Task<IEnumerable<GroupCount>> getUsersByGroupIds(List<int> groupIds)
        {
            throw new NotImplementedException();

        }


        public Task<IEnumerable<SurveyOption>> GetAnswerOptions(int QuestionId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> SubmitSurvey(int userId, int surveyId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Survey>> GetAllowedSurveys(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<UserGroup>> GetAllMyGroups(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<SurveyQuestion> CreateSurveyQuestion(int surveyId, string questionText, List<string> options)
        {
            throw new NotImplementedException();
        }

        // public Task<SurveyQuestion> UpdateSurveyQuestion(int questionId, string questionText, List<string> options = null)
        public Task<IEnumerable<SurveyQuestion>> GetAllQuestionOfSurvey(int surveyId)
        {
            throw new NotImplementedException();
        }
    }
}
