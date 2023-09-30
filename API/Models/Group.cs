using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Group : BaseEntity
    {
        public Group(string name)
        {
            Name = name;
            Users = new List<User>();
            SurveysAssigned = new HashSet<Survey>();
        }

        public string Name { get; set; }

        public ICollection<User> Users { get; set; }

        public ICollection<Survey> SurveysAssigned { get; set; }
    }
}
