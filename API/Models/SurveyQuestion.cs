using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class SurveyQuestion : BaseEntity
    {
        public SurveyQuestion()
        {
            // Your constructor logic here
        }

        [Required]
        public string Heading { get; set; }

        public int SurveyId { get; set; }
        public virtual Survey Survey { get; set; }

        public virtual ICollection<SurveyOption> Options { get; set; }
    }
}
