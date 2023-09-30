using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class SurveyAnswer : BaseEntity
    {
        public int OptionId { get; set; }

        public int UserId { get; set; }

        public virtual SurveyOption Option { get; set; }

        public virtual User User { get; set; }
    }
}
