using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repo
{
    public class SurveyAnswerRepository
    {
        private readonly DataContext _dc;
        public SurveyAnswerRepository(DataContext dc)
        {
            this._dc = dc;
        }
    }
}
