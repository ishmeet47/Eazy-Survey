using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Survey : BaseEntity
    {
        public Survey()
        {
            // initialization logic, if any

            AssignedTo = new HashSet<Group>();
            CompletedBy = new HashSet<User>();
            Questions = new List<SurveyQuestion>();
            GroupSurveys = new List<GroupSurvey>();
        }
        public Survey(string title, DateTime? dueDate = null, String? description = "")
        {
            Title = title;
            DueDate = dueDate;
            IsPublished = false;  // Set default valu
            AssignedTo = new HashSet<Group>();
            CompletedBy = new HashSet<User>();
            // Questions = new HashSet<SurveyQuestion>();
            this.Questions = new List<SurveyQuestion>();
            Description = description;
            this.SurveyUsers = new HashSet<SurveyUser>();

        }

        public bool IsPublished { get; set; } = false;

        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }

        public DateTime? DueDate { get; set; }

        public virtual ICollection<Group> AssignedTo { get; set; }

        public virtual ICollection<User> CompletedBy { get; set; }

        public virtual ICollection<SurveyQuestion> Questions { get; set; } = new List<SurveyQuestion>();

        public virtual ICollection<GroupSurvey> GroupSurveys { get; set; }

        public virtual ICollection<SurveyUser> SurveyUsers { get; set; }


    }
}
