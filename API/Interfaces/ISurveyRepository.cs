using API.Models;

namespace API.Interfaces
{
    public interface ISurveyRepository
    {
        Task<Survey> CreateSurvey(string title, DateTime? dueDate = null);
        Task<Survey> GetSurvey(int id);
        Task<IEnumerable<Survey>> GetSurveys();
        Task<Survey> UpdateSurvey(int id, string title, DateTime? dueDate = null);
        Task DeleteSurvey(int id);
    }
}
