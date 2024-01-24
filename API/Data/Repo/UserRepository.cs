﻿using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace API.Data.Repo
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _dc;
        public UserRepository(DataContext dc)
        {
            this._dc = dc;

        }
        public async Task<User?> Authenticate(string userName, string passwordText)
        {
            var user = await _dc.Users.FirstOrDefaultAsync(x => x.Username == userName);

            if (user == null || user.PasswordKey == null)
                return null;

            if (!MatchPasswordHash(passwordText, user.Password, user.PasswordKey))
                return null;

            return user;
        }

        private bool MatchPasswordHash(string passwordText, byte[] password, byte[] passwordKey)
        {
            using (var hmac = new HMACSHA512(passwordKey))
            {
                var passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passwordText));

                for (int i = 0; i < passwordHash.Length; i++)
                {
                    if (passwordHash[i] != password[i])
                        return false;
                }

                return true;
            }
        }

        public void Register(string userName, string password)
        {
            byte[] passwordHash, passwordKey;

            using (var hmac = new HMACSHA512())
            {
                passwordKey = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

            }

            User user = new User(
                username: userName,
                password: passwordHash,
                passwordKey: passwordKey
            );

            _dc.Users.Add(user);
        }

        public async Task<bool> UserAlreadyExists(string userName)
        {
            return await _dc.Users.AnyAsync(x => x.Username == userName);
        }
    }
}
