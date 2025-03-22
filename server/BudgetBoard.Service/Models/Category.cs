using BudgetBoard.Database.Models;
using System.Text.Json.Serialization;

namespace BudgetBoard.Service.Models;

public interface ICategory
{
    public string Value { get; set; }
    public string Parent { get; set; }
}

public class CategoryBase : ICategory
{
    public string Value { get; set; }
    public string Parent { get; set; }

    [JsonConstructor]
    public CategoryBase()
    {
        Value = string.Empty;
        Parent = string.Empty;
    }
}

public interface ICategoryCreateRequest : ICategory
{
}

public class CategoryCreateRequest : ICategoryCreateRequest
{
    public string Value { get; set; }
    public string Parent { get; set; }

    [JsonConstructor]
    public CategoryCreateRequest()
    {
        Value = string.Empty;
        Parent = string.Empty;
    }
}

public interface ICategoryUpdateRequest
{
    Guid ID { get; set; }
    string Value { get; set; }
    string Parent { get; set; }
}
public class CategoryUpdateRequest : ICategoryUpdateRequest
{
    public Guid ID { get; set; }
    public string Value { get; set; }
    public string Parent { get; set; }

    [JsonConstructor]
    public CategoryUpdateRequest()
    {
        ID = Guid.Empty;
        Value = string.Empty;
        Parent = string.Empty;
    }
}

public interface ICategoryResponse
{
    Guid ID { get; set; }
    string Value { get; set; }
    string Parent { get; set; }
    Guid UserID { get; set; }
}
public class CategoryResponse : ICategoryResponse
{
    public Guid ID { get; set; }
    public string Value { get; set; }
    public string Parent { get; set; }
    public Guid UserID { get; set; }

    [JsonConstructor]
    public CategoryResponse()
    {
        ID = Guid.Empty;
        Value = string.Empty;
        Parent = string.Empty;
        UserID = Guid.Empty;
    }

    public CategoryResponse(Category category)
    {
        ID = category.ID;
        Value = category.Value;
        Parent = category.Parent;
        UserID = category.UserID;
    }
}
