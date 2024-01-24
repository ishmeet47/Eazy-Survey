using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using API.Models;  // If your User model is located here
using System.Linq;
using API.Interfaces;
using API.Repositories;
using API.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors();

// Updated to include EnableRetryOnFailure
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("SQLExpress"),
        sqlOptions => sqlOptions.EnableRetryOnFailure());
});

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ISurveyRepository, SurveyRepositoryService>();
builder.Services.AddScoped<IGroupService, GroupService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration.GetSection("AppSettings:Secret").Value)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

// Seed Admin User
using var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<DataContext>();

try
{
    var adminUser = context.Users
        .Where(u => u.Username == "admin")
        .Select(u => new
        {
            u.Id,
            u.Username,
            Password = (byte[])u.Password,
            PasswordKey = (byte[])u.PasswordKey,
            u.UserType,
            // ... any other necessary fields
        })
        .AsNoTracking()
        .FirstOrDefault();

    if (adminUser == null)
    {
        var utility = new PasswordUtility();
        var (hashedPassword, salt) = utility.HashPassword("adminpassword");

        var user = new User("admin", hashedPassword, salt, "Admin");
        context.Users.Add(user);

        context.SaveChanges();
    }
}
catch (Exception ex)
{
    // Log the exception or handle it as appropriate
    Console.WriteLine($"Error seeding admin user: {ex.Message}");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(m => m.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// Routing should be placed before Authentication and Authorization.
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
