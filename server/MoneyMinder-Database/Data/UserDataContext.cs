using BudgetBoard.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace BudgetBoard.Database.Data
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

            modelBuilder.Entity<User>().ToTable("User")
                .HasMany(e => e.Accounts)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserID);


            modelBuilder.Entity<Account>().ToTable("Account")
                .HasMany(e => e.Transactions)
                .WithOne(e => e.Account)
                .HasForeignKey(e => e.AccountID);

            modelBuilder.Entity<Transaction>().ToTable("Transaction");

            modelBuilder.UseIdentityColumns();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
    }
}