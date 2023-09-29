using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            this.Users = this.Set<User>();
            this.Surveys = this.Set<Survey>();
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Survey> Surveys { get; set; }
    }
}