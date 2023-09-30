using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Survey : BaseEntity
    {
        public Survey(string title, DateTime? dueDate = null)
        {
            Title = title;
            DueDate = dueDate;
            AssignedTo = new HashSet<Group>();
            CompletedBy = new HashSet<User>();
            Questions = new HashSet<SurveyQuestion>();
        }

        [Required]
        public string Title { get; set; }
        public DateTime? DueDate { get; set; }

        public ICollection<Group> AssignedTo { get; set; }

        public ICollection<User> CompletedBy { get; set; }

        public ICollection<SurveyQuestion> Questions { get; set; }
    }
}
