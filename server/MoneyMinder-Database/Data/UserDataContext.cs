using Microsoft.EntityFrameworkCore;
using MoneyMinder.Database.Models;

namespace MoneyMinder.Database.Data
{
    public class UserDataContext : DbContext
    {
        public UserDataContext(DbContextOptions<UserDataContext> options) :
            base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.UseSerialColumns();
        }

        public DbSet<User> Users { get; set; }
    }
}