using BudgetBoard.Database.Models;

namespace BudgetBoard.Models;

public class AddCategoryRequest
{
    public string Value { get; set; } = string.Empty;
    public string Parent { get; set; } = string.Empty;
}

public class CategoryResponse(Category category)
{
    public Guid ID { get; set; } = category.ID;
    public string Value { get; set; } = category.Value;
    public string Parent { get; set; } = category.Parent;
    public bool Deleted { get; set; } = category.Deleted;
    public Guid UserID { get; set; } = category.UserID;
}
