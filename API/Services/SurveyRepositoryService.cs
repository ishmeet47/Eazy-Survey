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
using static API.Models.Requests.ExtendedSurveyRequest.QuestionWithOptions;
using static SurveyController;
using Microsoft.VisualBasic;
using Castle.Core.Internal;
using static API.Models.SurveyUser;
namespace API.Repositories
{
    public class SurveyRepositoryService : ISurveyRepository
    {
        private readonly DataContext _context;

        public SurveyRepositoryService(DataContext context)
        {
            _context = context;
        }


        // public Task<Survey> CreateSurvey(string title, DateTime? dueDate, List<(string heading, int questionId, List<Option> Options)> questionsWithOptions, List<int> userGroupIds, string description)
        // {
        //     throw new NotImplementedException();
        // }

        public async Task<Survey> CreateSurvey(string title, DateTime? dueDate,
      List<(string heading, int questionId, List<Option> Options)> questionsWithOptions,
      List<int> userGroupIds, string description)
        {
            var survey = new Survey(title, dueDate, description)
            {
                IsPublished = false
            };

            foreach (var (questionText, questionId, options) in questionsWithOptions)
            {
                var question = new SurveyQuestion
                {
                    Heading = questionText,
                    IsPublished = false,
                    Id = questionId  // Assuming SurveyQuestion has an Id property, you can set it here.
                };

                foreach (var option in options)
                {
                    question.Options.Add(new SurveyOption { Label = option.Label });
                }

                survey.Questions.Add(question);
            }

            _context.Surveys.Add(survey);
            await _context.SaveChangesAsync();

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



        public async Task<List<OptionCount>> GetAnswerCountsByOptionIds(List<int> optionIds)
        {
            var counts = _context.SurveyAnswers
                .Where(sa => optionIds.Contains(sa.OptionId))
                .GroupBy(sa => sa.OptionId)
                .Select(g => new OptionCount { OptionId = g.Key, Count = g.Count() });

            return await counts.ToListAsync();
        }




        // public async Task<IEnumerable<GroupCount>> getUsersByGroupIds(List<int> groupIds)
        // {
        //     // Use EF Core to group and count the UserGroup entries by GroupId
        //     var groupCounts = _context.UserGroups
        //         .Where(ug => groupIds.Contains(ug.GroupId))
        //         .GroupBy(ug => ug.GroupId)
        //         .Select(g => new GroupCount { GroupId = g.Key, Count = g.Count() });

        //     return await groupCounts.ToListAsync();
        // }


        public async Task<IEnumerable<GroupCount>> getUsersByGroupIds(List<int> groupIds)
        {
            // If no group IDs are provided, return the count of all users from the Users table
            if (groupIds == null || !groupIds.Any())
            {
                var allUsersCount = await _context.Users.CountAsync();
                return new List<GroupCount> { new GroupCount { GroupId = 0, Count = allUsersCount } };
            }

            // Otherwise, proceed with the original logic using the UserGroups table
            var groupCounts = _context.UserGroups
                .Where(ug => groupIds.Contains(ug.GroupId))
                .GroupBy(ug => ug.GroupId)
                .Select(g => new GroupCount { GroupId = g.Key, Count = g.Count() });

            return await groupCounts.ToListAsync();
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


        // public async Task<IEnumerable<Survey>> GetSurveys()
        // {
        //     // Fetch the surveys along with related data.
        //     var surveys = await _context.Surveys
        //         .Include(s => s.Questions)
        //             .ThenInclude(q => q.Options)
        //         .Include(s => s.GroupSurveys)
        //                         .ToListAsync();
        //     return surveys;
        // }

        public async Task<IEnumerable<Survey>> GetSurveys()
        {
            // Fetch the surveys along with related data.
            var surveys = await _context.Surveys
                .Include(s => s.Questions)
                    .ThenInclude(q => q.Options)
                .Include(s => s.GroupSurveys)
                .Include(s => s.SurveyUsers)
                    .ThenInclude(su => su.User)
                .AsNoTracking() // Read-only, slight performance boost.
                .ToListAsync();

            return surveys; // As List<T> is an IEnumerable<T>, you can return it directly here.
        }


        // public async Task<IEnumerable<Survey>> GetSurveys()
        // {
        //     // Using projection to shape the data according to the Survey model.
        //     var surveys = await _context.Surveys
        //         .Select(s => new Survey
        //         {
        //             // Directly mapped fields
        //             Id = s.Id,
        //             IsPublished = s.IsPublished,
        //             Title = s.Title,
        //             Description = s.Description,
        //             DueDate = s.DueDate,

        //             // Navigation properties (with inner projections for related data)
        //             Questions = s.Questions
        //                 .Select(q => new SurveyQuestion
        //                 {
        //                     Id = q.Id,
        //                     Heading = q.Heading,
        //                     SurveyId = q.SurveyId,
        //                     IsPublished = q.IsPublished,
        //                     Options = q.Options.ToList()  // Assuming SurveyOption has properties that can be directly mapped.
        //                 }).ToList(),

        //             GroupSurveys = s.GroupSurveys.ToList(), // If further shaping needed, use Select.

        //             AssignedTo = s.GroupSurveys.Select(gs => gs.Group).ToHashSet(),  // Assuming Group has properties that can be directly mapped.

        //             CompletedBy = s.SurveyUsers.Select(su => new
        //             {
        //                 su.UserId,
        //                 su.User.Username
        //                 // This is an anonymous type; it doesn't instantiate a User object.
        //                 // Password and PasswordKey are omitted for security reasons.
        //             }).ToHashSet(),

        //             SurveyUsers = s.SurveyUsers.ToList()  // If further shaping needed, use Select.
        //         })
        //         .AsNoTracking() // Read-only, slight performance boost.
        //         .ToListAsync();

        //     return surveys;
        // }







        // public async Task<IEnumerable<object>> GetSurveys()
        // {
        //     // The projection happens within the database query itself, thanks to the IQueryable interface.
        //     var surveysWithUsernames = await _context.Surveys
        //         .AsNoTracking() // Use AsNoTracking to improve performance since the entities won't be modified.
        //         .Select(s => new
        //         {
        //             s.Id,
        //             s.Title,
        //             s.Description,
        //             s.DueDate,
        //             s.IsPublished,
        //             Questions = s.Questions.Select(q => new
        //             {
        //                 q.Id,
        //                 q.Heading,
        //                 q.IsPublished,
        //                 Options = q.Options.Select(o => new
        //                 {
        //                     o.Id,
        //                     o.Label
        //                 }),
        //                 // Including answers, if they are in a separate table.
        //                 // Answers = q.Answers.Select(a => new { ... })
        //             }),
        //             GroupSurveys = s.GroupSurveys.Select(gs => new
        //             {
        //                 gs.GroupId,
        //                 // Include other necessary properties from GroupSurveys
        //             }),
        //             Usernames = s.SurveyUsers.Select(su => su.User.Username) // Ensure navigation property is correct.
        //         })
        //         .ToListAsync();

        //     return surveysWithUsernames;
        // }








        // public async Task<Survey> UpdateSurvey(int id, string title, DateTime? dueDate, string description, List<(string heading, int questionId, List<Option> Options)> questionsWithOptions, List<int> userGroupIds)
        // {
        //     var survey = await _context.Surveys
        //                                .Include(s => s.Questions)
        //                                .ThenInclude(q => q.Options)
        //                                .FirstOrDefaultAsync(s => s.Id == id);
        //     if (survey == null || survey.IsPublished) return null;

        //     // 1. Update Survey details
        //     survey.Title = title;
        //     survey.DueDate = dueDate;
        //     survey.Description = description;



        //     // 2. Update questions
        //     foreach (var incomingQuestion in questionsWithOptions)
        //     {
        //         var question = survey.Questions.FirstOrDefault(q => q.Id == incomingQuestion.questionId);

        //         if (question == null) // Question does not exist in DB
        //         {
        //             question = new SurveyQuestion { Heading = incomingQuestion.heading };
        //             survey.Questions.Add(question); // Use navigation property to add question
        //         }
        //         else
        //         {
        //             question.Heading = incomingQuestion.heading; // Update existing question heading
        //         }

        //         // Handle the options for this question.
        //         foreach (var incomingOption in incomingQuestion.Options)
        //         {
        //             var option = question.Options.FirstOrDefault(o => o.Id == incomingOption.Id);

        //             if (option == null) // Option does not exist in DB
        //             {
        //                 option = new SurveyOption { Label = incomingOption.Label };
        //                 question.Options.Add(option); // Use navigation property to add option
        //             }
        //             else
        //             {
        //                 option.Label = incomingOption.Label; // Update existing option label
        //             }
        //         }

        //         // Remove options not in the incoming request
        //         var optionsToRemove = question.Options.Where(o => !incomingQuestion.Options.Any(io => io.Id == o.Id)).ToList();
        //         foreach (var opt in optionsToRemove)
        //         {
        //             // _context.SurveyOptions.Remove(opt); // Remove from context

        //             var optionToRemove = _context.SurveyOptions.Find(opt.Id);
        //             if (optionToRemove != null)
        //             {
        //                 _context.SurveyOptions.Remove(optionToRemove);
        //             }

        //         }
        //     }



        //     // Remove questions not in the incoming request
        //     var questionsToRemove = survey.Questions.Where(q => !questionsWithOptions.Any(iq => iq.questionId == q.Id)).ToList();
        //     foreach (var qst in questionsToRemove)
        //     {
        //         _context.SurveyQuestions.Remove(qst); // Remove from context
        //     }

        //     // 3. Update GroupSurveys
        //     var currentGroupSurveys = await _context.GroupSurveys.Where(gs => gs.SurveyId == id).ToListAsync();
        //     foreach (var groupId in userGroupIds)
        //     {
        //         if (!currentGroupSurveys.Any(gs => gs.GroupId == groupId))
        //         {
        //             _context.GroupSurveys.Add(new GroupSurvey
        //             {
        //                 SurveyId = survey.Id,
        //                 GroupId = groupId
        //             });
        //         }
        //     }

        //     // Remove group surveys not in the incoming request
        //     _context.GroupSurveys.RemoveRange(currentGroupSurveys.Where(gs => !userGroupIds.Contains(gs.GroupId)));

        //     await _context.SaveChangesAsync();

        //     return survey;
        // }




        // public async Task<Survey> UpdateSurvey(int id, string title, DateTime? dueDate, string description, List<(string heading, int questionId, List<Option> Options)> questionsWithOptions, List<int> userGroupIds)
        // {
        //     var survey = await _context.Surveys
        //                                .Include(s => s.Questions)
        //                                .ThenInclude(q => q.Options)
        //                                .FirstOrDefaultAsync(s => s.Id == id);
        //     if (survey == null || survey.IsPublished) return null;

        //     // 1. Update Survey details
        //     survey.Title = title;
        //     survey.DueDate = dueDate;
        //     survey.Description = description;

        //     // 2. Update questions
        //     foreach (var incomingQuestion in questionsWithOptions)
        //     {
        //         var question = survey.Questions.FirstOrDefault(q => q.Id == incomingQuestion.questionId);

        //         if (question == null) // Question does not exist in DB
        //         {
        //             question = new SurveyQuestion { Heading = incomingQuestion.heading };
        //             survey.Questions.Add(question); // Use navigation property to add question
        //         }
        //         else
        //         {
        //             question.Heading = incomingQuestion.heading; // Update existing question heading
        //         }

        //         // Handle the options for this question.
        //         foreach (var incomingOption in incomingQuestion.Options)
        //         {
        //             var option = question.Options.FirstOrDefault(o => o.Id == incomingOption.Id);

        //             if (option == null) // Option does not exist in DB
        //             {
        //                 option = new SurveyOption { Label = incomingOption.Label };
        //                 question.Options.Add(option); // Use navigation property to add option
        //             }
        //             else
        //             {
        //                 option.Label = incomingOption.Label; // Update existing option label
        //             }
        //         }

        //         // Remove options not in the incoming request
        //         var optionsToRemove = question.Options.Where(o => !incomingQuestion.Options.Any(io => io.Id == o.Id)).ToList();
        //         foreach (var opt in optionsToRemove)
        //         {
        //             var optionToRemove = _context.SurveyOptions.Find(opt.Id);
        //             if (optionToRemove != null)
        //             {
        //                 _context.SurveyOptions.Remove(optionToRemove);
        //             }
        //         }
        //     }

        //     // Remove questions not in the incoming request
        //     var questionsToRemove = survey.Questions.Where(q => !questionsWithOptions.Any(iq => iq.questionId == q.Id)).ToList();
        //     foreach (var qst in questionsToRemove)
        //     {
        //         var questionToRemove = _context.SurveyQuestions.Find(qst.Id);
        //         if (questionToRemove != null)
        //         {
        //             _context.SurveyQuestions.Remove(questionToRemove);
        //         }
        //     }

        //     // 3. Update GroupSurveys
        //     var currentGroupSurveys = await _context.GroupSurveys.Where(gs => gs.SurveyId == id).ToListAsync();
        //     foreach (var groupId in userGroupIds)
        //     {
        //         if (!currentGroupSurveys.Any(gs => gs.GroupId == groupId))
        //         {
        //             _context.GroupSurveys.Add(new GroupSurvey
        //             {
        //                 SurveyId = survey.Id,
        //                 GroupId = groupId
        //             });
        //         }
        //     }

        //     // Remove group surveys not in the incoming request
        //     _context.GroupSurveys.RemoveRange(currentGroupSurveys.Where(gs => !userGroupIds.Contains(gs.GroupId)));

        //     await _context.SaveChangesAsync();

        //     return survey;
        // }


        public async Task<Survey> UpdateSurvey(int id, string title, DateTime? dueDate, string description, List<(string heading, int questionId, List<Option> Options)> questionsWithOptions, List<int> userGroupIds)
        {
            var survey = await _context.Surveys
                                       .Include(s => s.Questions)
                                       .ThenInclude(q => q.Options)
                                       .FirstOrDefaultAsync(s => s.Id == id);
            if (survey == null || survey.IsPublished) return null;

            // 1. Update Survey details
            survey.Title = title;
            survey.DueDate = dueDate;
            survey.Description = description;

            // 2. Update questions
            foreach (var incomingQuestion in questionsWithOptions)
            {
                var question = survey.Questions.FirstOrDefault(q => q.Id == incomingQuestion.questionId);

                if (question == null)
                {
                    question = new SurveyQuestion { Heading = incomingQuestion.heading };
                    survey.Questions.Add(question);
                }
                else
                {
                    question.Heading = incomingQuestion.heading;
                }

                // Handle the options for this question.
                foreach (var incomingOption in incomingQuestion.Options)
                {
                    var option = question.Options.FirstOrDefault(o => o.Id == incomingOption.Id);

                    if (option == null)
                    {
                        option = new SurveyOption { Label = incomingOption.Label };
                        question.Options.Add(option);
                    }
                    else
                    {
                        option.Label = incomingOption.Label;
                    }
                }

                // Remove options not in the incoming request
                var optionsToRemove = question.Options.Where(o => !incomingQuestion.Options.Any(io => io.Id == o.Id)).ToList();
                foreach (var opt in optionsToRemove)
                {
                    var optionToRemove = _context.SurveyOptions.Find(opt.Id);
                    if (optionToRemove != null)
                    {
                        // First remove related SurveyAnswers before removing the option
                        var answersToRemove = _context.SurveyAnswers.Where(sa => sa.OptionId == optionToRemove.Id).ToList();
                        _context.SurveyAnswers.RemoveRange(answersToRemove);

                        _context.SurveyOptions.Remove(optionToRemove);
                    }
                }
            }

            // Remove questions not in the incoming request
            var questionsToRemove = survey.Questions.Where(q => !questionsWithOptions.Any(iq => iq.questionId == q.Id)).ToList();
            foreach (var qst in questionsToRemove)
            {
                var questionToRemove = _context.SurveyQuestions.Find(qst.Id);
                if (questionToRemove != null)
                {
                    _context.SurveyQuestions.Remove(questionToRemove);
                }
            }

            // 3. Update GroupSurveys
            var currentGroupSurveys = await _context.GroupSurveys.Where(gs => gs.SurveyId == id).ToListAsync();
            foreach (var groupId in userGroupIds)
            {
                if (!currentGroupSurveys.Any(gs => gs.GroupId == groupId))
                {
                    _context.GroupSurveys.Add(new GroupSurvey
                    {
                        SurveyId = survey.Id,
                        GroupId = groupId
                    });
                }
            }

            // Remove group surveys not in the incoming request
            _context.GroupSurveys.RemoveRange(currentGroupSurveys.Where(gs => !userGroupIds.Contains(gs.GroupId)));

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

        // public async Task<bool> DeleteSurvey(int id)
        // {
        //     // Fetch the survey with all related entities
        //     var survey = await _context.Surveys.Include(s => s.Questions)
        //                                        .ThenInclude(q => q.Options)  // Assuming `Options` is the name of the navigation property in SurveyQuestion pointing to SurveyOption entities.
        //                                        .Include(s => s.GroupSurveys)
        //                                        .FirstOrDefaultAsync(s => s.Id == id);

        //     if (survey == null) return false;

        //     // Delete related questions and their options
        //     foreach (var question in survey.Questions)
        //     {
        //         // Delete options related to this question
        //         _context.SurveyOptions.RemoveRange(question.Options);  // If `Options` isn't the correct name of the navigation property, replace it with the correct one.

        //         _context.SurveyQuestions.Remove(question);
        //     }

        //     // Delete group associations
        //     _context.GroupSurveys.RemoveRange(survey.GroupSurveys);

        //     // If you need to remove user associations or anything else, do so here.

        //     _context.Surveys.Remove(survey);
        //     await _context.SaveChangesAsync();
        //     return true;
        // }




        // public async Task<bool> DeleteSurvey(int id)
        // {
        //     // Fetch the survey with all related entities, including answers.
        //     var survey = await _context.Surveys
        //         .Include(s => s.Questions)
        //             .ThenInclude(q => q.Options)
        //                 .ThenInclude(o => o.Answers) // Include the answers linked to options.
        //         .Include(s => s.GroupSurveys)
        //         .FirstOrDefaultAsync(s => s.Id == id);

        //     if (survey == null) return false;

        //     // Before deleting the options, delete the answers that reference them.
        //     foreach (var question in survey.Questions)
        //     {
        //         foreach (var option in question.Options)
        //         {
        //             _context.SurveyAnswers.RemoveRange(option.Answers);
        //         }

        //         // After deleting the answers, you can delete the options.
        //         _context.SurveyOptions.RemoveRange(question.Options);

        //         // Then proceed to delete the question itself.
        //         _context.SurveyQuestions.Remove(question);
        //     }

        //     // Delete group associations.
        //     _context.GroupSurveys.RemoveRange(survey.GroupSurveys);

        //     // Finally, delete the survey itself after all referencing records have been deleted.
        //     _context.Surveys.Remove(survey);

        //     // Save the changes.
        //     await _context.SaveChangesAsync();

        //     return true;
        // }

        public async Task<bool> DeleteSurvey(int id)
        {
            // Fetch the survey with all related entities, ensuring the context tracks all of them.
            var survey = await _context.Surveys
                .Include(s => s.Questions)
                    .ThenInclude(q => q.Options)
                        .ThenInclude(o => o.Answers) // Load answers to ensure they are tracked for deletion.
                .Include(s => s.GroupSurveys) // If there's a relationship with groups, include it.
                .FirstOrDefaultAsync(s => s.Id == id);

            if (survey == null)
            {
                // Survey not found, return false.
                return false;
            }

            // Start by handling the most deeply nested entities (answers) first.
            foreach (var question in survey.Questions)
            {
                foreach (var option in question.Options)
                {
                    // Remove all answers related to the current option.
                    _context.SurveyAnswers.RemoveRange(option.Answers);
                }

                // Now that the answers are removed, we can safely delete the options.
                _context.SurveyOptions.RemoveRange(question.Options);

                // With the options (and their answers) removed, delete the question itself.
                _context.SurveyQuestions.Remove(question);
            }

            // If the survey is linked to groups, handle that relationship before deleting the survey.
            _context.GroupSurveys.RemoveRange(survey.GroupSurveys);

            // Now, all dependencies have been cleared, and the survey can be safely removed.
            _context.Surveys.Remove(survey);

            // Apply the changes to the database.
            await _context.SaveChangesAsync();

            return true; // Deletion was successful.
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

        public async Task<SurveyQuestion> UpdateSurveyQuestion(int questionId, string questionText, List<Option> Options)
        {
            var question = await _context.SurveyQuestions.FindAsync(questionId);
            if (question == null) return null;

            question.Heading = questionText;

            if (Options != null && Options.Any())
            {
                // This simple implementation will remove old options and add the new ones.
                // You might need to adjust it based on your specific requirements.
                question.Options.Clear();

                // Note: Assuming `Option` has a property named `Label` which is a string
                foreach (var option in Options)
                {
                    if (string.IsNullOrEmpty(option.Label))
                    {
                        throw new ArgumentException("Option text cannot be null or empty.");
                    }
                    question.Options.Add(new SurveyOption { Label = option.Label });
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

        public async Task<IEnumerable<SurveyOption>> GetAnswerOptions(int QuestionId)
        {
            return await _context.SurveyOptions.Where(q => q.QuestionId == QuestionId).ToListAsync();
        }

        public async Task<bool> SubmitSurvey(int userId, int surveyId)
        {

            // update all the questions in question list to be published

            var answers = _context.SurveyAnswers.Where(ans => ans.UserId == userId && ans.SurveyQuestionId == surveyId);

            foreach (var ans in answers)
            {
                Console.Write(ans.Id);
                ans.IsPublished = true;
            }

            // add user complete to the UserSurvey DB
            var surveyuser = new SurveyUser
            {
                UserId = userId,
                SurveyId = surveyId
            };
            // User user = _context.Users.Where(user => user.Id == userId);
            // Survey survey =  _context.Surveys.Where(sur => sur.Id == surveyId);
            // survey.CompletedBy.Add()
            //
            _context.SurveyUsers.Add(surveyuser);
            var result = await _context.SaveChangesAsync();
            return result > 0;

        }

        public async Task<IEnumerable<Survey>> GetAllowedSurveys(int userId)
        {
            List<Survey> SurveyList = new List<Survey>();
            List<int> groups = new List<int>();
            List<int> surveyIds = new List<int>();

            var belongToGroup = await _context.UserGroups.Where(user => user.UserId == userId).ToListAsync();
            foreach (var userGroup in belongToGroup)
            {
                //Console.Write(userGroup.GroupId);
                int groupId = userGroup.GroupId;
                groups.Add(groupId);
            }
            //Console.WriteLine("size of this surveyIds is: " + groups.Count);
            /// ok now I have groups I need to pull all the survey that concluded in these groups
            foreach (int group in groups)
            {
                // _surveys is a GroupSurvey elementd
                var _surveys = await _context.GroupSurveys.Where(gs => gs.GroupId == group).ToListAsync();
                //Console.WriteLine("size of this _survey is: " + _surveys.Count);
                foreach (var survey in _surveys)
                {
                    if (!surveyIds.Contains(survey.SurveyId))
                        surveyIds.Add(survey.SurveyId);
                }
            }
            /// now I have all the survey allowed stored in surveys, call prev function and return
            foreach (var id in surveyIds)
            {
                var survey = await _context.SurveyUsers.Where(su => su.SurveyId == id && su.UserId == userId).ToListAsync();
                var temp_s = await _context.Surveys.FindAsync(id);
                bool published = temp_s.IsPublished;
                // check if already answered
                if (survey.IsNullOrEmpty() && published)
                {
                    var Sur = await GetSurvey(id);
                    SurveyList.Add(Sur);
                }

            }

            return SurveyList.ToArray();
        }

        public async Task<IEnumerable<UserGroup>> GetAllMyGroups(int userId)
        {
            var belongToGroup = await _context.UserGroups.Where(group => group.UserId == userId).ToListAsync();
            return belongToGroup;
        }


        public async Task<IEnumerable<SurveyQuestion>> GetAllQuestionOfSurvey(int surveyId)
        {
            return await _context.SurveyQuestions.Where(Question => Question.SurveyId == surveyId).ToListAsync();
        }

        // public async Task<IEnumerable<Survey>> GetAllSubmittedSurvey(int userId)
        // {
        //     List<Survey> submitSurveyList = new List<Survey>();

        //     var SurveyUsers = await _context.SurveyUsers.Where(su => su.UserId == userId).ToListAsync();

        //     Console.WriteLine("Hi");
        //     Console.WriteLine("Count: " + SurveyUsers.Count);

        //     foreach (var su in SurveyUsers)
        //     {
        //         var Sur = await GetSurvey(su.SurveyId);
        //         submitSurveyList.Add(Sur);
        //         // submitSurveyList.Add(su.Survey);
        //     }

        //     return submitSurveyList.ToArray();
        // }

        public async Task<IEnumerable<Survey>> GetAllSubmittedSurvey(int userId)
        {
            List<Survey> SurveyList = new List<Survey>();
            List<int> groups = new List<int>();
            List<int> surveyIds = new List<int>();

            var belongToGroup = await _context.UserGroups.Where(user => user.UserId == userId).ToListAsync();
            foreach (var userGroup in belongToGroup)
            {
                //Console.Write(userGroup.GroupId);
                int groupId = userGroup.GroupId;
                groups.Add(groupId);
            }
            //Console.WriteLine("size of this surveyIds is: " + groups.Count);
            /// ok now I have groups I need to pull all the survey that concluded in these groups
            foreach (int group in groups)
            {
                // _surveys is a GroupSurvey elementd
                var _surveys = await _context.GroupSurveys.Where(gs => gs.GroupId == group).ToListAsync();
                //Console.WriteLine("size of this _survey is: " + _surveys.Count);
                foreach (var survey in _surveys)
                {
                    if (!surveyIds.Contains(survey.SurveyId))
                        surveyIds.Add(survey.SurveyId);
                }
            }

            Console.WriteLine();

            /// now I have all the survey allowed stored in surveys, call prev function and return
            foreach (var id in surveyIds)
            {
                var survey = await _context.SurveyUsers.Where(su => su.SurveyId == id && su.UserId == userId).ToListAsync();
                var temp_s = await _context.Surveys.FindAsync(id);
                bool published = temp_s.IsPublished;

                Console.WriteLine("Count: " + survey.Count);

                // check if already answered
                if (!survey.IsNullOrEmpty() && published)
                {
                    var Sur = await GetSurvey(id);
                    SurveyList.Add(Sur);
                }

            }

            return SurveyList.ToArray();
        }
    }

}
