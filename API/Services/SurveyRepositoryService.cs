using API.Interfaces;
using API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using System.Security.Cryptography;

namespace API.Repositories
{
    public class SurveyRepositoryService : ISurveyRepository
    {
        private readonly DataContext _context;

        public SurveyRepositoryService(DataContext context)
        {
            _context = context;
        }

        public async Task<Survey> CreateSurvey(string title, DateTime? dueDate = null)
        {
            var survey = new Survey(title, dueDate);
            _context.Surveys.Add(survey);
            await _context.SaveChangesAsync();
            return survey;
        }

        public async Task<Survey> GetSurvey(int id)
        {
            return await _context.Surveys.FindAsync(id);
        }

        public async Task<IEnumerable<Survey>> GetSurveys()
        {
            return _context.Surveys.ToList();
        }

        public async Task<Survey> UpdateSurvey(int id, string title, DateTime? dueDate = null)
        {
            var survey = await _context.Surveys.FindAsync(id);
            if (survey == null) return null;

            survey.Title = title;
            survey.DueDate = dueDate;

            _context.Entry(survey).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return survey;
        }

        public async Task DeleteSurvey(int id)
        {
            var survey = await _context.Surveys.FindAsync(id);
            if (survey != null)
            {
                _context.Surveys.Remove(survey);
                await _context.SaveChangesAsync();
            }
        }
    }
}
