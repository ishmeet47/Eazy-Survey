using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Survey : BaseEntity
    {
        public Survey(string title, DateTime? dueDate = null)
        {
            Title = title;
            DueDate = dueDate;
        }

        [Required]
        public string Title { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
