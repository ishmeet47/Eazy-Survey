using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class SurveyQuestion : BaseEntity
    {

        [Required]
        public string Heading { get; set; }

        public int SurveyId { get; set; }
        public Survey Survey { get; set; }

        public ICollection<SurveyOption> Options { get; set; }
    }
}
