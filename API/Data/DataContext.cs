using API.Models;
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
        public DbSet<GroupSurvey> GroupSurveys { get; set; }   // This represents the join table.

        public DbSet<SurveyUser> SurveyUsers { get; set; }   // This represents the join table.

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GroupSurvey>()
       .HasKey(gs => new { gs.SurveyId, gs.GroupId });

            modelBuilder.Entity<SurveyUser>()
               .HasKey(su => new { su.UserId, su.SurveyId });



            modelBuilder.Entity<SurveyUser>()
             .HasOne(su => su.Survey)
             .WithMany(s => s.SurveyUsers)
             .HasForeignKey(su => su.SurveyId);

            modelBuilder.Entity<SurveyUser>()
                .HasOne(su => su.User)
                .WithMany(u => u.SurveyUsers) // You might need to add this navigation property in the 'User' model as well
                .HasForeignKey(su => su.UserId);

            // check for this relationship... 

            modelBuilder.Entity<Survey>()
                .HasMany(s => s.GroupSurveys)
                .WithOne(gs => gs.Survey)
                .HasForeignKey(gs => gs.SurveyId);



            // Composite key for SurveyAnswer
            modelBuilder.Entity<SurveyAnswer>()
                .HasKey(sa => new { sa.OptionId, sa.UserId });

            // Many-to-many relationship between Survey and Groups
            modelBuilder.Entity<Survey>()
                .HasMany(s => s.AssignedTo)
                .WithMany(g => g.SurveysAssigned);

            // One-to-many relationship between Survey and SurveyQuestion
            modelBuilder.Entity<SurveyQuestion>()
                .HasOne(sq => sq.Survey)
                .WithMany(s => s.Questions)
                .HasForeignKey(sq => sq.SurveyId);

            // One-to-many relationship between SurveyQuestion and SurveyOption
            modelBuilder.Entity<SurveyOption>()
                .HasOne(so => so.Question)
                .WithMany(sq => sq.Options)
                .HasForeignKey(so => so.QuestionId);


            modelBuilder.Entity<SurveyOption>()
                .HasMany(o => o.Answers)
                .WithOne(sa => sa.Option)
                .HasForeignKey(sa => sa.OptionId)
                .OnDelete(DeleteBehavior.Cascade);




            // One-to-many relationship between SurveyAnswer and SurveyOption
            modelBuilder.Entity<SurveyAnswer>()
                .HasOne(sa => sa.Option)
                .WithMany()
                .HasForeignKey(sa => sa.OptionId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-many relationship between SurveyAnswer and User
            modelBuilder.Entity<SurveyAnswer>()
                .HasOne(sa => sa.User)
                .WithMany()
                .HasForeignKey(sa => sa.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-many relationship between SurveyAnswer and SurveyQuestion
            modelBuilder.Entity<SurveyAnswer>()
                .HasOne(sa => sa.SurveyQuestion)
                .WithMany(sq => sq.SurveyAnswers)
                .HasForeignKey(sa => sa.SurveyQuestionId)
                .OnDelete(DeleteBehavior.Restrict);

            // Many-to-many relationship between User and Group using UserGroup join table
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

            // Setting column types for User properties
            modelBuilder.Entity<User>()
                .Property(u => u.Password)
                .HasColumnType("varbinary(MAX)");

            modelBuilder.Entity<User>()
                .Property(u => u.PasswordKey)
                .HasColumnType("varbinary(MAX)");


            modelBuilder.Entity<SurveyAnswer>()
     .HasOne(sa => sa.Option) // Corrected to use the actual name of the navigation property
     .WithMany(so => so.Answers) // This should match the name of the collection in SurveyOption
     .HasForeignKey(sa => sa.OptionId)
     .OnDelete(DeleteBehavior.Cascade); // Set the cascade delete


        }




        //     protected override void OnModelCreating(ModelBuilder modelBuilder)
        //     {
        //         modelBuilder.Entity<SurveyAnswer>()
        //             .HasKey(sa => new { sa.OptionId, sa.UserId });

        //         // many-to-many relationship between Survey and Groups
        //         modelBuilder.Entity<Survey>()
        //             .HasMany(s => s.AssignedTo)
        //             .WithMany(g => g.SurveysAssigned);

        //         // one-to-many relationship between Survey and SurveyQuestion
        //         modelBuilder.Entity<SurveyQuestion>()
        //             .HasOne(sq => sq.Survey)
        //             .WithMany(s => s.Questions)
        //             .HasForeignKey(sq => sq.SurveyId);

        //         // one-to-many relationship between SurveyQuestion and SurveyOption
        //         modelBuilder.Entity<SurveyOption>()
        //             .HasOne(so => so.Question)
        //             .WithMany(sq => sq.Options)
        //             .HasForeignKey(so => so.QuestionId);

        //         // one-to-many relationship between SurveyAnswer and SurveyOption, but only SurveyAnswer has a navigation property
        //         modelBuilder.Entity<SurveyAnswer>()
        //             .HasOne(sa => sa.Option)
        //             .WithMany()
        //             .HasForeignKey(sa => sa.OptionId);

        //         // one-to-many relationship between SurveyAnswer and User, but only SurveyAnswer has a navigation property
        //         modelBuilder.Entity<SurveyAnswer>()
        //             .HasOne(sa => sa.User)
        //             .WithMany()
        //             .HasForeignKey(sa => sa.UserId);

        //         // many-to-many relationship between User and Group using UserGroup join table
        //         modelBuilder.Entity<UserGroup>()
        //             .HasKey(ug => new { ug.UserId, ug.GroupId });

        //         modelBuilder.Entity<UserGroup>()
        //             .HasOne(ug => ug.User)
        //             .WithMany(u => u.UserGroups)
        //             .HasForeignKey(ug => ug.UserId);

        //         modelBuilder.Entity<UserGroup>()
        //             .HasOne(ug => ug.Group)
        //             .WithMany(g => g.UserGroups)
        //             .HasForeignKey(ug => ug.GroupId);

        //         modelBuilder.Entity<User>()
        //             .Property(u => u.Password)
        //             .HasColumnType("varbinary(MAX)");

        //         modelBuilder.Entity<User>()
        //             .Property(u => u.PasswordKey)
        //             .HasColumnType("varbinary(MAX)");


        //         // one-to-many relationship between SurveyQuestion and SurveyOption
        //         modelBuilder.Entity<SurveyOption>()
        //             .HasOne(so => so.Question)
        //             .WithMany(sq => sq.Options)
        //             .HasForeignKey(so => so.QuestionId);

        //         //     modelBuilder.Entity<SurveyAnswer>()
        //         // .HasOne(sa => sa.Option)
        //         // .WithMany(so => so.Answers)
        //         // .HasForeignKey(sa => sa.OptionId)
        //         // .OnDelete(DeleteBehavior.Cascade); // Cascade on delete for SurveyOption to SurveyAnswer

        //         //     modelBuilder.Entity<SurveyAnswer>()
        //         //         .HasOne(sa => sa.SurveyQuestion)
        //         //         .WithMany(sq => sq.Answers)
        //         //         .HasForeignKey(sa => sa.SurveyQuestionId)
        //         //         .OnDelete(DeleteBehavior.Restrict);

        //         //     modelBuilder.Entity<SurveyAnswer>()
        //         //   .HasOne(sa => sa.SurveyQuestion)
        //         //   .WithMany(sq => sq.SurveyAnswers)
        //         //   .OnDelete(DeleteBehavior.Restrict);


        //         //         modelBuilder.Entity<SurveyAnswer>()
        //         //   .HasOne(sa => sa.SurveyQuestion)
        //         //   .WithMany(sq => sq.SurveyAnswers)
        //         //   .HasForeignKey(sa => sa.SurveyQuestionId)
        //         //   .OnDelete(DeleteBehavior.Restrict); // 




        //         modelBuilder.Entity<SurveyAnswer>()
        // .HasOne(sa => sa.Option)
        // .WithMany()
        // .HasForeignKey(sa => sa.OptionId)
        // .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete to avoid multiple cascade paths

        //         modelBuilder.Entity<SurveyAnswer>()
        //             .HasOne(sa => sa.User)
        //             .WithMany()
        //             .HasForeignKey(sa => sa.UserId)
        //             .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

        //         modelBuilder.Entity<SurveyAnswer>()
        //             .HasOne(sa => sa.SurveyQuestion)
        //             .WithMany(sq => sq.SurveyAnswers)
        //             .HasForeignKey(sa => sa.SurveyQuestionId)
        //             .OnDelete(DeleteBehavior.Restrict);


        //     }
    }
}
