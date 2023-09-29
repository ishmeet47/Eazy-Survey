using API.Interfaces;
using API.Models;

namespace API.Data.Repo
{
    public class SurveyRepository : ISurveyRepository
    {
        public Task<Survey> CreateSurvey(string title, DateTime? dueDate = null)
        {
            throw new NotImplementedException();
        }

        public Task DeleteSurvey(int id)
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

        public Task<Survey> UpdateSurvey(int id, string title, DateTime? dueDate = null)
        {
            throw new NotImplementedException();
        }
    }
}
