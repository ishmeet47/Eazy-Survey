
namespace API.Models
{
    public class SurveyOption : BaseEntity
    {
        public string Label { get; set; }

        public int QuestionId { get; set; }
        public SurveyQuestion Question { get; set; }
    }
}
