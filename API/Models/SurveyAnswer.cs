namespace API.Models
{
    public class SurveyAnswer : BaseEntity
    {
        public int Id { get; set; }
        public int OptionId { get; set; }
        public int UserId { get; set; }
        public virtual SurveyOption Option { get; set; }
        public virtual User User { get; set; }
        public int SurveyQuestionId { get; set; }
        public virtual SurveyQuestion SurveyQuestion { get; set; }
    }
}
