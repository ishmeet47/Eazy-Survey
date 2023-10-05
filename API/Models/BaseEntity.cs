using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class BaseEntity
    {
        [Column(Order = 0)]
        public int Id { get; set; }
        public DateTime LastUpdatedOn { get; set; } = DateTime.Now;
        public int LastUpdatedBy { get; set; }
        public bool IsPublished { get; set; }

    }
}