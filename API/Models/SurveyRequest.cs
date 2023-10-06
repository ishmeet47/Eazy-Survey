using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class SurveyRequest
    {
        public string Title { get; set; }
        public DateTime? DueDate { get; set; }
        public List<string> Questions { get; set; } = new List<string>();
    }

}