using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using System.Security.Cryptography;

public class UserService : IUserService
{
    private readonly DataContext _context;

    public UserService(DataContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateUserAsync(string username, string password)
    {
        // You can use the HashPassword method from AuthController or a similar one to hash the password
        byte[] passwordKey = GenerateSalt(); 
        byte[] hashedPassword = HashPassword(password, passwordKey);

        var user = new User(username, hashedPassword, passwordKey); // No need to specify UserType, it defaults to 'User'
        _context.Users.Add(user);
        var result = await _context.SaveChangesAsync();
        return result > 0;
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
