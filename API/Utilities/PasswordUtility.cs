using System.Security.Cryptography;

public class PasswordUtility
{
    public (byte[] hashedPassword, byte[] salt) HashPassword(string password)
    {
        using var hmac = new HMACSHA512();

        var salt = hmac.Key;
        var hashedPassword = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

        return (hashedPassword, salt);
    }

    public bool VerifyPassword(byte[] storedHash, byte[] storedSalt, string passwordAttempt)
    {
        using var hmac = new HMACSHA512(storedSalt);

        var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passwordAttempt));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != storedHash[i]) return false;
        }

        return true;
    }
}
