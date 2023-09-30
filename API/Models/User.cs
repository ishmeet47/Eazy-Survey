namespace API.Models;
using System.ComponentModel.DataAnnotations;

public class User : BaseEntity
{
    public User
    (
        string username,
        byte[] password,
        byte[] passwordKey,
        string userType = "User"
    )
    {
        Username = username;
        Password = password;
        PasswordKey = passwordKey;
        UserType = userType;
        Groups = new HashSet<Group>();
        SurveysCompleted = new HashSet<Survey>();
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

    public ICollection<Group> Groups { get; set; }

    public ICollection<Survey> SurveysCompleted { get; set; }
}
