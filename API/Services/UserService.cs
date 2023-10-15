using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using System.Security.Cryptography;
using API.DTO;

public class UserService : IUserService
{
    private readonly DataContext _context;

    public UserService(DataContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateUserAsync(string username, string password, List<int> groupIds)
    {
        byte[] passwordKey = GenerateSalt();
        byte[] hashedPassword = HashPassword(password, passwordKey);

        var user = new User(username, hashedPassword, passwordKey);

        // Check and add user groups
        if (groupIds != null && groupIds.Any())
        {
            foreach (var groupId in groupIds)
            {
                var group = await _context.Groups.FindAsync(groupId);
                if (group != null)
                {
                    user.UserGroups.Add(new UserGroup
                    {
                        User = user,
                        Group = group
                    });
                }
            }
        }

        _context.Users.Add(user);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }



    public async Task<IEnumerable<User>> GetUsersAsync()
    {
        return await _context.Users
                             .Include(u => u.UserGroups)
                             .ThenInclude(ug => ug.Group)
                             .ToListAsync();
    }


    // public async Task<IEnumerable<UserDto>> GetUsersAsync()
    // {
    //     var users = await _context.Users
    //                               .Include(u => u.UserGroups)
    //                               .ThenInclude(ug => ug.Group)
    //                               .ToListAsync();

    //     return users.Select(u => new UserDto
    //     {
    //         Username = u.Username,
    //         UserType = u.UserType,
    //         Groups = u.UserGroups.Select(ug => new GroupDto { Name = ug.Group.Name }).ToList()
    //     });
    // }



    public async Task<bool> AddUserToGroupsAsync(int userId, List<int> groupIds)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        foreach (var groupId in groupIds)
        {
            var group = await _context.Groups.FindAsync(groupId);
            if (group == null) continue; // Skip this iteration if group not found

            user.UserGroups.Add(new UserGroup
            {
                User = user,
                Group = group
            });
        }

        var result = await _context.SaveChangesAsync();
        return result > 0;
    }


    public async Task<bool> RemoveUserFromGroupAsync(int userId, int groupId)
    {
        var userGroup = await _context.UserGroups
                                       .Where(ug => ug.UserId == userId && ug.GroupId == groupId)
                                       .FirstOrDefaultAsync();
        if (userGroup == null) return false;

        _context.UserGroups.Remove(userGroup);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteUserAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        _context.Users.Remove(user);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> UpdateUserAsync(int userId, UpdateUserRequest request)
    {
        var user = await _context.Users.Include(u => u.UserGroups).FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return false;

        byte[] hashedPassword = user.Password;
        byte[] passwordKey = user.PasswordKey;

        if (request.ChangePassword && !string.IsNullOrEmpty(request.Password))
        {
            passwordKey = GenerateSalt();
            hashedPassword = HashPassword(request.Password, passwordKey);
        }

        user.Username = request.Username;
        user.Password = hashedPassword;
        user.PasswordKey = passwordKey;

        // Assuming you have a UserGroup entity that has a UserId and GroupId properties
        if (request.GroupIds != null)
        {
            // Remove existing associations
            _context.UserGroups.RemoveRange(user.UserGroups);

            // Add updated associations
            foreach (var groupId in request.GroupIds)
            {
                var group = await _context.Groups.FindAsync(groupId);
                if (group != null)
                {
                    user.UserGroups.Add(new UserGroup
                    {
                        UserId = user.Id,
                        GroupId = groupId
                    });
                }
            }
        }

        _context.Users.Update(user);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }


    public async Task<IEnumerable<Group>> GetGroupsAsync()
    {
        return await _context.Groups.ToListAsync();
    }

    public async Task<bool> CreateGroupAsync(string groupName)
    {
        var group = new Group(groupName);  // Assuming Group has a constructor that sets the Name property
        _context.Groups.Add(group);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> AddUserAsync(string username, string password, List<int> groupIds = null)
    {
        // Check if a user with the same username already exists.
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (existingUser != null)
        {
            // If a user with the same username exists, return false.
            return false;
        }

        byte[] passwordKey = GenerateSalt();
        byte[] hashedPassword = HashPassword(password, passwordKey);

        var user = new User(username, hashedPassword, passwordKey);
        _context.Users.Add(user);

        // If groupIds are provided, loop through each ID and add a corresponding UserGroup
        if (groupIds != null && groupIds.Count > 0)
        {
            foreach (var groupId in groupIds)
            {
                var group = await _context.Groups.FindAsync(groupId);
                if (group != null)
                {
                    user.UserGroups.Add(new UserGroup
                    {
                        User = user,
                        Group = group
                    });
                }
            }
        }

        var result = await _context.SaveChangesAsync();
        return result > 0;
    }



    public async Task<User> GetUserByIdAsync(int userId)
    {
        return await _context.Users.FindAsync(userId);
    }

    private byte[] GenerateSalt()
    {
        using var hmac = new HMACSHA512();
        return hmac.Key;
    }

    private byte[] HashPassword(string password, byte[] salt)
    {
        using var hmac = new HMACSHA512(salt);
        return hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
    }
}
