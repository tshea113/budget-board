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

            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<Account>().ToTable("Account");
            modelBuilder.Entity<Transaction>().ToTable("Transaction");

            modelBuilder.UseIdentityColumns();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
    }
}