using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Models.Requests
{
    public class AnswerRequest
    {
        public int userId { get; set; }
        public List<int> optionIdList { get; set; }
    }
}