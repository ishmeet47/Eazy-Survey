using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Requests
{
    public class SubmitSurveyRequest
    {
        public int userId { get; set; }
        public int surveyId { get; set; }
    }
}