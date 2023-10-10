using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static API.Models.Requests.ExtendedSurveyRequest.QuestionWithOptions;

namespace API.Models.Requests
{
    public class ExtendedSurveyRequest
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }  // <-- Add this line


        public DateTime? DueDate { get; set; }

        [Required]
        public List<QuestionWithOptions> QuestionsWithOptions { get; set; }

        // public List<QuestionModel> Questions { get; set; }


        public List<int> UserGroupIds { get; set; }

        public class QuestionWithOptions
        {
            public int Id { get; set; }
            public string Heading { get; set; }
            public int SurveyId { get; set; }
            public bool IsPublished { get; set; }
            public List<Option> Options { get; set; }
            // public List<SurveyAnswer> SurveyAnswers { get; set; } // Assuming SurveyAnswer is another class you have
            public DateTime LastUpdatedOn { get; set; }
            public int LastUpdatedBy { get; set; }

            public class Option
            {
                public int Id { get; set; }
                public string Label { get; set; }
                public int QuestionId { get; set; }
            }
        }

        // If you don't have a class for SurveyAnswer, define it here.
        // public SurveyAnswer surveyAnswer { get; set; }


    }

    public class QuestionModel
    {
        public string heading { get; set; }
        public List<Option> options { get; set; }
    }
}
