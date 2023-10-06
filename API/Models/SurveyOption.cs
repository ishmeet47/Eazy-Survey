using API.Models;

public class SurveyOption
{
    public int Id { get; set; }
    public string Label { get; set; } // This is the missing property based on the error.

    // Navigation properties
    public int QuestionId { get; set; }
    public SurveyQuestion Question { get; set; } // This is the missing navigation property.

    public virtual ICollection<SurveyAnswer> Answers { get; set; } = new List<SurveyAnswer>();

}
