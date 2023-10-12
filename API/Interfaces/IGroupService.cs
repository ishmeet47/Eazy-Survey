using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models;

namespace API.Interfaces
{
    public interface IGroupService
    {
        Task<IEnumerable<Group>> GetGroupsAsync();
        Task<bool> CreateGroupAsync(String group);
        // Other necessary method signatures as needed

        Task DeleteGroupAndAssociations(int groupId);

        Task<List<Group>> GetGroupsBySurveyIdAsync(int surveyId);


    }
}
