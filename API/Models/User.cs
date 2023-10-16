using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Models
{
    public class User : BaseEntity
    {
        public User(string username, byte[] password, byte[] passwordKey, string userType = "User")
        {
            Username = username;
            Password = password;
            PasswordKey = passwordKey;
            UserType = userType;
            UserGroups = new HashSet<UserGroup>();
            SurveysCompleted = new HashSet<Survey>();
            this.SurveyUsers = new HashSet<SurveyUser>();

        }

        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 8)]
        public byte[] Password { get; set; }

        [Required]
        public byte[] PasswordKey { get; set; }

        [Required]
        public string UserType { get; set; }


        public ICollection<UserGroup> UserGroups { get; set; }

        public virtual ICollection<Survey> SurveysCompleted { get; set; }


        public virtual ICollection<SurveyUser> SurveyUsers { get; set; }

    }
}
