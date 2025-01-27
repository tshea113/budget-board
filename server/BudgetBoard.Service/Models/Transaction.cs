﻿using BudgetBoard.Database.Models;
using System.Text.Json.Serialization;

namespace BudgetBoard.Service.Models;

public class TransactionSource
{
    private TransactionSource(string value) { Value = value; }

    public string Value { get; set; }

    public static TransactionSource Manual { get { return new TransactionSource("Manual"); } }
    public static TransactionSource SimpleFIN
    {
        get { return new TransactionSource("SimpleFIN"); }
    }
}

public interface ITransactionCreateRequest
{
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? Category { get; set; }
    public string? Subcategory { get; set; }
    public string? MerchantName { get; set; }
    public Guid AccountID { get; set; }
}

public class TransactionCreateRequest : ITransactionCreateRequest
{
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? Category { get; set; }
    public string? Subcategory { get; set; }
    public string? MerchantName { get; set; }
    public Guid AccountID { get; set; }

    [JsonConstructor]
    public TransactionCreateRequest()
    {
        Amount = 0.0M;
        Date = DateTime.MinValue;
        Category = null;
        Subcategory = null;
        MerchantName = null;
        AccountID = Guid.NewGuid();
    }
}

public interface ITransactionUpdateRequest
{
    public Guid ID { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? Category { get; set; }
    public string? Subcategory { get; set; }
    public string? MerchantName { get; set; }
    public DateTime? Deleted { get; set; }
}

public class TransactionUpdateRequest : ITransactionUpdateRequest
{
    public Guid ID { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? Category { get; set; }
    public string? Subcategory { get; set; }
    public string? MerchantName { get; set; }
    public DateTime? Deleted { get; set; }

    [JsonConstructor]
    public TransactionUpdateRequest()
    {
        ID = Guid.NewGuid();
        Amount = 0.0M;
        Date = DateTime.MinValue;
        Category = null;
        Subcategory = null;
        MerchantName = null;
        Deleted = null;
    }
}

public interface ITransactionResponse
{
    public Guid ID { get; set; }
    public string? SyncID { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? Category { get; set; }
    public string? Subcategory { get; set; }
    public string? MerchantName { get; set; }
    public bool Pending { get; set; }
    public DateTime? Deleted { get; set; }
    public string Source { get; set; }
    public Guid AccountID { get; set; }
}

public class TransactionResponse : ITransactionResponse
{
    public Guid ID { get; set; }
    public string? SyncID { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? Category { get; set; }
    public string? Subcategory { get; set; }
    public string? MerchantName { get; set; }
    public bool Pending { get; set; }
    public DateTime? Deleted { get; set; }
    public string Source { get; set; }
    public Guid AccountID { get; set; }

    [JsonConstructor]
    public TransactionResponse()
    {
        ID = Guid.NewGuid();
        SyncID = null;
        Amount = 0.0M;
        Date = DateTime.MinValue;
        Category = null;
        Subcategory = null;
        MerchantName = null;
        Source = string.Empty;
        AccountID = Guid.NewGuid();
    }

    public TransactionResponse(Transaction transaction)
    {
        ID = transaction.ID;
        SyncID = transaction.SyncID;
        Amount = transaction.Amount;
        Date = transaction.Date;
        Category = transaction.Category;
        Subcategory = transaction.Subcategory;
        MerchantName = transaction.MerchantName;
        Pending = transaction.Pending;
        Deleted = transaction.Deleted;
        Source = transaction.Source;
        AccountID = transaction.AccountID;
    }
}
