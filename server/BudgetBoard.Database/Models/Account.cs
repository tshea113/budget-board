﻿namespace BudgetBoard.Database.Models;

public class Account
{
    public Guid ID { get; set; }
    public string? SyncID { get; set; }
    public required string Name { get; set; }
    public Guid? InstitutionID { get; set; }
    public Institution Institution { get; set; } = null!;
    public string Type { get; set; } = "";
    public string Subtype { get; set; } = "";
    public bool HideTransactions { get; set; } = false;
    public bool HideAccount { get; set; } = false;
    public DateTime? Deleted { get; set; } = null;
    public int Index { get; set; }
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public ICollection<Goal> Goals { get; set; } = new List<Goal>();
    public ICollection<Balance> Balances { get; set; } = new List<Balance>();
    public required Guid UserID { get; set; }
    public ApplicationUser? User { get; set; } = null!;
}
