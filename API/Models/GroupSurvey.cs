namespace API.Models
{
    public class GroupSurvey
    {
        public int SurveyId { get; set; }
        public virtual Survey Survey { get; set; }

        public int GroupId { get; set; }
        public Group Group { get; set; }

        // You can add additional properties if needed
    }
}
