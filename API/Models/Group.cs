using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Models
{
    public class Group : BaseEntity
    {
        public Group(string name)
        {
            Name = name;
            UserGroups = new HashSet<UserGroup>();
            SurveysAssigned = new HashSet<Survey>();
        }

        [Required]
        public string Name { get; set; }

        [JsonIgnore]
        public ICollection<UserGroup> UserGroups { get; set; }

        public virtual ICollection<Survey> SurveysAssigned { get; set; }
    }
}
