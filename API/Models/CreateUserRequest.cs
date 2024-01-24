using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class CreateUserRequest
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public List<int> GroupIds { get; set; } = new List<int>();
    }
}
