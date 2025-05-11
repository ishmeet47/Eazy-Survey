using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class CreateGroupRequest
    {
        [Required]
        public string Name { get; set; }
    }
}
