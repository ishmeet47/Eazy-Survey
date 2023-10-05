using API.Data;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace API.Repositories
{
    public class SurveyRepositoryService : ISurveyRepository
    {
        private readonly DataContext _context;

        public SurveyRepositoryService(DataContext context)
        {
            _context = context;
        }

        async Task<Survey> ISurveyRepository.CreateSurvey(string title, DateTime? dueDate,
     List<(string QuestionText, List<string> Options)> questionsWithOptions,
     List<int> userGroupIds)
        {
            if (questionsWithOptions == null)
            {
                throw new ArgumentNullException(nameof(questionsWithOptions));
            }

            if (_context == null)
            {
                throw new InvalidOperationException("Database context is not initialized.");
            }

            var survey = new Survey(title, dueDate)
            {
                IsPublished = false
            };

            if (survey.Questions == null)
            {
                throw new InvalidOperationException("The Questions collection in the Survey class is not initialized.");
            }

            foreach (var (questionText, options) in questionsWithOptions)
            {
                if (string.IsNullOrEmpty(questionText))
                {
                    throw new ArgumentException("Question text cannot be null or empty.");
                }

                if (options == null)
                {
                    throw new ArgumentNullException($"Options for question: '{questionText}' is null.");
                }

                var question = new SurveyQuestion
                {
                    Heading = questionText,
                    IsPublished = false
                };

                if (question.Options == null)
                {
                    throw new InvalidOperationException("The Options collection in the SurveyQuestion class is not initialized.");
                }

                foreach (var optionText in options)
                {
                    if (string.IsNullOrEmpty(optionText))
                    {
                        throw new ArgumentException($"Option text for question: '{questionText}' cannot be null or empty.");
                    }
                    question.Options.Add(new SurveyOption { Label = optionText });
                }

                survey.Questions.Add(question);
            }

            _context.Surveys.Add(survey);
            await _context.SaveChangesAsync();

            // Associate the survey with user groups
            foreach (var groupId in userGroupIds)
            {
                _context.GroupSurveys.Add(new GroupSurvey
                {
                    SurveyId = survey.Id,
                    GroupId = groupId
                });
            }

            await _context.SaveChangesAsync();

            return survey;
        }




        public async Task<bool> DeleteSurveyQuestion(int questionId)
        {
            var surveyQuestion = await _context.SurveyQuestions.FindAsync(questionId);
            if (surveyQuestion == null) return false;

            // First delete related answers
            var relatedAnswers = _context.SurveyAnswers.Where(sa => sa.SurveyQuestionId == questionId);
            _context.SurveyAnswers.RemoveRange(relatedAnswers);

            // Then delete the question itself
            _context.SurveyQuestions.Remove(surveyQuestion);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Survey> GetSurvey(int id)
        {
            return await _context.Surveys.FindAsync(id);
        }

        public async Task<IEnumerable<Survey>> GetSurveys()
        {
            return await _context.Surveys
                .Include(s => s.Questions)
                    .ThenInclude(q => q.Options)
                .ToListAsync();
        }


        public async Task<Survey> UpdateSurvey(int id, string title, DateTime? dueDate = null)
        {
            var survey = await _context.Surveys.FindAsync(id);
            if (survey == null || survey.IsPublished) return null;

            survey.Title = title;
            survey.DueDate = dueDate;

            _context.Entry(survey).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return survey;
        }

        public async Task<bool> PublishSurvey(int id)
        {
            var survey = await _context.Surveys.FindAsync(id);
            if (survey == null) return false;

            survey.IsPublished = true;
            _context.Entry(survey).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AssignSurveyToGroups(int surveyId, List<int> groupIds)
        {
            var survey = await _context.Surveys.FindAsync(surveyId);
            if (survey == null || survey.IsPublished) return false;

            var groups = await _context.Groups.Where(g => groupIds.Contains(g.Id)).ToListAsync();
            foreach (var group in groups)
            {
                survey.AssignedTo.Add(group);
            }

            _context.Entry(survey).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteSurvey(int id)
        {
            var survey = await _context.Surveys.FindAsync(id);
            if (survey == null) return false;

            _context.Surveys.Remove(survey);
            await _context.SaveChangesAsync();
            return true;
        }




        // Implementation for SurveyQuestion operations
        public async Task<SurveyQuestion> CreateSurveyQuestion(int surveyId, string questionText, List<string> options)
        {
            var survey = await _context.Surveys.FindAsync(surveyId);
            if (survey == null) return null;

            var question = new SurveyQuestion { Heading = questionText };

            foreach (var optionText in options)
            {
                question.Options.Add(new SurveyOption { Label = optionText });
            }

            survey.Questions.Add(question);
            await _context.SaveChangesAsync();

            return question;
        }

        public async Task<SurveyQuestion> GetSurveyQuestion(int questionId)
        {
            return await _context.SurveyQuestions.FindAsync(questionId);
        }

        public async Task<IEnumerable<SurveyQuestion>> GetSurveyQuestionsBySurveyId(int surveyId)
        {
            return await _context.SurveyQuestions.Where(q => q.SurveyId == surveyId).ToListAsync();
        }

        public async Task<SurveyQuestion> UpdateSurveyQuestion(int questionId, string questionText, List<string> options = null)
        {
            var question = await _context.SurveyQuestions.FindAsync(questionId);
            if (question == null) return null;

            question.Heading = questionText;

            if (options != null && options.Any())
            {
                // This simple implementation will remove old options and add the new ones.
                // You might need to adjust it based on your specific requirements.
                question.Options.Clear();
                foreach (var optionText in options)
                {
                    question.Options.Add(new SurveyOption { Label = optionText });
                }
            }

            _context.Entry(question).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return question;
        }

        // Implementation for SurveyAnswer operations
        public async Task<SurveyAnswer> CreateSurveyAnswer(int userId, int optionId)
        {
            var user = await _context.Users.FindAsync(userId);
            var option = await _context.SurveyOptions.FindAsync(optionId);

            if (user == null || option == null) return null;

            var answer = new SurveyAnswer { UserId = userId, OptionId = optionId, SurveyQuestionId = option.QuestionId };
            _context.SurveyAnswers.Add(answer);
            await _context.SaveChangesAsync();

            return answer;
        }

        public async Task<SurveyAnswer> GetSurveyAnswer(int userId, int optionId)
        {
            return await _context.SurveyAnswers.FirstOrDefaultAsync(sa => sa.UserId == userId && sa.OptionId == optionId);
        }

        public async Task<IEnumerable<SurveyAnswer>> GetSurveyAnswersByUserId(int userId)
        {
            return await _context.SurveyAnswers.Where(sa => sa.UserId == userId).ToListAsync();
        }

        public async Task<bool> DeleteSurveyAnswer(int userId, int optionId)
        {
            var answer = await _context.SurveyAnswers.FirstOrDefaultAsync(sa => sa.UserId == userId && sa.OptionId == optionId);
            if (answer == null) return false;

            _context.SurveyAnswers.Remove(answer);
            await _context.SaveChangesAsync();

            return true;
        }
    }

}
