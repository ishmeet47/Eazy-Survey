﻿using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            // These initializations are unnecessary. Entity Framework will handle this automatically.
            // Removing them for clarity.
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Survey> Surveys { get; set; }
        public DbSet<SurveyQuestion> SurveyQuestions { get; set; }
        public DbSet<SurveyOption> SurveyOptions { get; set; }
        public DbSet<SurveyAnswer> SurveyAnswers { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; } // Added this for the join table

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SurveyAnswer>()
                .HasKey(sa => new { sa.OptionId, sa.UserId });

            // many-to-many relationship between Survey and Groups
            modelBuilder.Entity<Survey>()
                .HasMany(s => s.AssignedTo)
                .WithMany(g => g.SurveysAssigned);

            // one-to-many relationship between Survey and SurveyQuestion
            modelBuilder.Entity<SurveyQuestion>()
                .HasOne(sq => sq.Survey)
                .WithMany(s => s.Questions)
                .HasForeignKey(sq => sq.SurveyId);

            // one-to-many relationship between SurveyQuestion and SurveyOption
            modelBuilder.Entity<SurveyOption>()
                .HasOne(so => so.Question)
                .WithMany(sq => sq.Options)
                .HasForeignKey(so => so.QuestionId);

            // one-to-many relationship between SurveyAnswer and SurveyOption, but only SurveyAnswer has a navigation property
            modelBuilder.Entity<SurveyAnswer>()
                .HasOne(sa => sa.Option)
                .WithMany()
                .HasForeignKey(sa => sa.OptionId);

            // one-to-many relationship between SurveyAnswer and User, but only SurveyAnswer has a navigation property
            modelBuilder.Entity<SurveyAnswer>()
                .HasOne(sa => sa.User)
                .WithMany()
                .HasForeignKey(sa => sa.UserId);

            // many-to-many relationship between User and Group using UserGroup join table
            modelBuilder.Entity<UserGroup>()
                .HasKey(ug => new { ug.UserId, ug.GroupId });

            modelBuilder.Entity<UserGroup>()
                .HasOne(ug => ug.User)
                .WithMany(u => u.UserGroups)
                .HasForeignKey(ug => ug.UserId);

            modelBuilder.Entity<UserGroup>()
                .HasOne(ug => ug.Group)
                .WithMany(g => g.UserGroups)
                .HasForeignKey(ug => ug.GroupId);

            modelBuilder.Entity<User>()
                .Property(u => u.Password)
                .HasColumnType("varbinary(MAX)");

            modelBuilder.Entity<User>()
                .Property(u => u.PasswordKey)
                .HasColumnType("varbinary(MAX)");
        }
    }
}
