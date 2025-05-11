using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models;

public interface IUserService
{
    // Existing method to create a new user
    Task<bool> CreateUserAsync(string username, string password, List<int> groupIds = null);

    // Retrieve all users
    Task<IEnumerable<User>> GetUsersAsync();

    // Add a user (without group association; that's done separately)
    Task<bool> AddUserAsync(string username, string password, List<int> groupIds = null);

    // Delete a user
    Task<bool> DeleteUserAsync(int userId);

    // Update a user's details
    Task<bool> UpdateUserAsync(int userId, UpdateUserRequest updatedUser);

    // Add user to a group
    Task<bool> AddUserToGroupsAsync(int userId, List<int> groupIds);

    // Remove user from a group
    Task<bool> RemoveUserFromGroupAsync(int userId, int groupId);

    // Retrieve all groups
    Task<IEnumerable<Group>> GetGroupsAsync();

    // Create a new group
    Task<bool> CreateGroupAsync(string groupName);

    Task<User> GetUserByIdAsync(int userId);


}
