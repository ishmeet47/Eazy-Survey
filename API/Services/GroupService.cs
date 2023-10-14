using API.Models;
using API.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using API.Interfaces;

namespace API.Services
{
    public class GroupService : IGroupService
    {
        private readonly DataContext _context;

        public GroupService(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Group>> GetGroupsAsync()
        {
            return await _context.Groups.ToListAsync();
        }


        public async Task<List<Group>> GetGroupsBySurveyIdAsync(int surveyId)
        {
            return await _context.GroupSurveys
                .Where(gs => gs.SurveyId == surveyId)
                .Select(gs => gs.Group)
                .ToListAsync();
        }


        public async Task<bool> CreateGroupAsync(string groupName)
        {
            var group = new Group(groupName);
            _context.Groups.Add(group);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task DeleteGroupAndAssociations(int groupId)
        {
            var strategy = _context.Database.CreateExecutionStrategy();

            await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    // Delete all UserGroup entries associated with this groupId
                    var userGroups = _context.UserGroups.Where(ug => ug.GroupId == groupId);
                    _context.UserGroups.RemoveRange(userGroups);

                    // Delete the group from the Group table
                    var group = await _context.Groups.FindAsync(groupId);
                    if (group != null)
                    {
                        _context.Groups.Remove(group);
                    }

                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }



    }
}
