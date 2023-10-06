using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Models.Requests
{
    public class ExtendedSurveyRequest
    {
        [Required]
        public string Title { get; set; }

        public DateTime? DueDate { get; set; }

        [Required]
        public List<QuestionWithOptions> QuestionsWithOptions { get; set; }

        public List<int> UserGroupIds { get; set; }

        public class QuestionWithOptions
        {
            [Required]
            public string QuestionText { get; set; }

            [Required]
            public List<string> Options { get; set; }
        }
    }
}
