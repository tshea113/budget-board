using Microsoft.EntityFrameworkCore;
using MoneyMinder.Database.Models;

namespace MoneyMinder.Database.Data;
public class TransactionDataContext : DbContext
{
    public TransactionDataContext(DbContextOptions<TransactionDataContext> options) :
        base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.UseSerialColumns();
    }

    public DbSet<Transaction> Transactions { get; set; }
}
