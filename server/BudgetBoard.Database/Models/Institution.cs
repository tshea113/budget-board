namespace BudgetBoard.Database.Models
{
    public class Institution
    {
        public Guid ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Index { get; set; } = 0;
        public required Guid UserID { get; set; }
        public ApplicationUser? User { get; set; } = null;
        public ICollection<Account> Accounts { get; set; } = [];
    }
}
