using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            this.Users = this.Set<User>();
            this.Groups = this.Set<Group>();
            this.Surveys = this.Set<Survey>();
            this.SurveyQuestions = this.Set<SurveyQuestion>();
            this.SurveyOptions = this.Set<SurveyOption>();
            this.SurveyAnswers = this.Set<SurveyAnswer>();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Survey> Surveys { get; set; }
        public DbSet<SurveyQuestion> SurveyQuestions { get; set; }
        public DbSet<SurveyOption> SurveyOptions { get; set; }
        public DbSet<SurveyAnswer> SurveyAnswers { get; set; }

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

            // many-to-many relationship between user and group
            modelBuilder.Entity<User>()
                .HasMany(u => u.Groups)
                .WithMany(g => g.Users);

            modelBuilder.Entity<User>()
                .Property(u => u.Password)
                .HasColumnType("varbinary(MAX)");

            modelBuilder.Entity<User>()
                .Property(u => u.PasswordKey)
                .HasColumnType("varbinary(MAX)");


        }
    }
}