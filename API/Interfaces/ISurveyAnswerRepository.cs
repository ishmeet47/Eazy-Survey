using API.Models;

namespace API.Interfaces
{
    public interface ISurveyAnswerRepository
    {

        void AnswerQuestion(SurveyOption option, SurveyQuestion Question);

        Task<IEnumerable<SurveyOption>> GetAnswersAsync(int QuestionId);

        // Impliment this feature if have time in the future 
        // void UpdateAnswerToQuestion(SurveyOption option, int QuestionId);
        
    }
}
