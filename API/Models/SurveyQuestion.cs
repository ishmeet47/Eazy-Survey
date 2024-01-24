using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class SurveyQuestion : BaseEntity
    {
        public SurveyQuestion()
        {
            SurveyAnswers = new List<SurveyAnswer>();
            this.Options = new List<SurveyOption>();

        }

        [Required]
        public string Heading { get; set; }
        public int SurveyId { get; set; }

        public bool IsPublished { get; set; }

        public virtual Survey Survey { get; set; }
        public virtual ICollection<SurveyOption> Options { get; set; } = new List<SurveyOption>();
        public virtual ICollection<SurveyAnswer> SurveyAnswers { get; set; }
    }
}
