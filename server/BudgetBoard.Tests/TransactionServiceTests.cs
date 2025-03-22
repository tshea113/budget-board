using Bogus;
using BudgetBoard.IntegrationTests.Fakers;
using BudgetBoard.Service;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Models;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BudgetBoard.IntegrationTests;

[Collection("IntegrationTests")]
public class TransactionServiceTests
{
    private readonly Faker<TransactionCreateRequest> _transactionCreateRequestFaker = new Faker<TransactionCreateRequest>()
    .RuleFor(t => t.SyncID, f => f.Random.String(20))
    .RuleFor(t => t.Amount, f => f.Finance.Amount())
    .RuleFor(t => t.Date, f => f.Date.Past())
    .RuleFor(t => t.Category, f => f.Random.String(10))
    .RuleFor(t => t.Subcategory, f => f.Random.String(10))
    .RuleFor(t => t.MerchantName, f => f.Random.String(10))
    .RuleFor(t => t.Source, f => f.Random.String(10));

    [Fact]
    public async Task CreateTransactionAsync_InvalidUserId_ThrowsError()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var transaction = _transactionCreateRequestFaker.Generate();

        // Act
        Func<Task> act = async () => await transactionService.CreateTransactionAsync(Guid.NewGuid(), transaction);

        // Assert
        await act.Should().ThrowAsync<BudgetBoardServiceException>().WithMessage("Provided user not found.");
    }

    [Fact]
    public async Task CreateTransactionAsync_ShouldCreateTransaction()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        helper.UserDataContext.Accounts.Add(account);
        helper.UserDataContext.SaveChanges();

        var transaction = _transactionCreateRequestFaker.Generate();
        transaction.AccountID = account.ID;

        // Act
        await transactionService.CreateTransactionAsync(helper.demoUser.Id, transaction);

        // Assert
        helper.UserDataContext.Transactions.Should().ContainSingle();
        helper.UserDataContext.Transactions.Single().Should().BeEquivalentTo(transaction);
    }

    [Fact]
    public async Task CreateTransactionAsync_WhenAccountDoesNotExist_ShouldThrowException()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var transaction = _transactionCreateRequestFaker.Generate();

        // Act
        Func<Task> act = async () => await transactionService.CreateTransactionAsync(helper.demoUser.Id, transaction);

        // Assert
        await act.Should().ThrowAsync<BudgetBoardServiceException>().WithMessage("The account you are trying to add a transaction to does not exist.");
    }

    [Fact]
    public async Task ReadTransactionsAsync_ShouldReturnTransactions()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        var transactionFaker = new TransactionFaker() { AccountIds = [account.ID] };
        var transactions = transactionFaker.Generate(5);

        account.Transactions = transactions;

        helper.UserDataContext.Accounts.Add(account);
        helper.UserDataContext.SaveChanges();

        // Act
        var result = await transactionService.ReadTransactionsAsync(helper.demoUser.Id, null, null, false);

        // Assert
        result.Should().HaveCount(5);
        result.Should().BeEquivalentTo(transactions.Select(t => new TransactionResponse(t)));
    }

    [Fact]
    public async Task ReadTransactionsAsync_WhenTransactionDoesNotExist_ShouldThrowException()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        // Act
        Func<Task> act = async () => await transactionService.ReadTransactionsAsync(helper.demoUser.Id, null, null, false, Guid.NewGuid());

        // Assert
        await act.Should().ThrowAsync<BudgetBoardServiceException>().WithMessage("The transaction you are trying to access does not exist.");
    }

    [Fact]
    public async Task ReadTransactionsAsync_WhenYearIsProvided_ShouldReturnTransactionsForYear()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        var transactionFaker = new TransactionFaker() { AccountIds = [account.ID] };
        var transactions = transactionFaker.Generate(5);

        account.Transactions = transactions;

        helper.UserDataContext.Accounts.Add(account);
        helper.UserDataContext.SaveChanges();

        var year = DateTime.Now.Year;

        // Act
        var result = await transactionService.ReadTransactionsAsync(helper.demoUser.Id, year, null, false);

        // Assert
        result.Should().HaveCount(transactions.Where(t => t.Date.Year == year).Count());
        result.Should().BeEquivalentTo(transactions.Where(t => t.Date.Year == year).Select(t => new TransactionResponse(t)));
    }

    [Fact]
    public async Task ReadTransactionsAsync_WhenMonthIsProvided_ShouldReturnTransactionsForMonth()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        var transactionFaker = new TransactionFaker() { AccountIds = [account.ID] };
        var transactions = transactionFaker.Generate(5);

        account.Transactions = transactions;

        helper.UserDataContext.Accounts.Add(account);
        helper.UserDataContext.SaveChanges();

        var month = DateTime.Now.Month;

        // Act
        var result = await transactionService.ReadTransactionsAsync(helper.demoUser.Id, null, month, false);

        // Assert
        result.Should().HaveCount(transactions.Where(t => t.Date.Month == month).Count());
        result.Should().BeEquivalentTo(transactions.Where(t => t.Date.Month == month).Select(t => new TransactionResponse(t)));
    }

    [Fact]
    public async Task ReadTransactionsAsync_WhenGetHiddenIsTrue_ShouldReturnHiddenTransactions()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        var transactionFaker = new TransactionFaker() { AccountIds = [account.ID] };
        var transactions = transactionFaker.Generate(5);

        account.Transactions = transactions;

        helper.UserDataContext.Accounts.Add(account);
        helper.UserDataContext.SaveChanges();

        // Act
        var result = await transactionService.ReadTransactionsAsync(helper.demoUser.Id, null, null, true);

        // Assert
        result.Should().HaveCount(5);
        result.Should().BeEquivalentTo(transactions.Select(t => new TransactionResponse(t)));
    }

    [Fact]
    public async Task ReadTransactionsAsync_WhenTransactionIsHidden_ShouldNotReturnHiddenTransaction()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        var transactionFaker = new TransactionFaker() { AccountIds = [account.ID] };
        var transactions = transactionFaker.Generate(5);

        account.Transactions = transactions;
        account.HideTransactions = true;

        helper.UserDataContext.Accounts.Add(account);
        helper.UserDataContext.SaveChanges();

        // Act
        var result = await transactionService.ReadTransactionsAsync(helper.demoUser.Id, null, null, false);

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task UpdateTransactionAsync_ShouldUpdateTransaction()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        var transactionFaker = new TransactionFaker() { AccountIds = [account.ID] };
        var transactions = transactionFaker.Generate(5);

        account.Transactions = transactions;

        helper.UserDataContext.Accounts.Add(account);
        helper.UserDataContext.SaveChanges();

        var editedTransaction = new TransactionUpdateRequest
        {
            ID = transactions.First().ID,
            Amount = 100.0M,
            Date = DateTime.Now,
            Category = "newCategory",
            Subcategory = "newSubcategory",
            MerchantName = "newMerchantName",
        };

        // Act
        await transactionService.UpdateTransactionAsync(helper.demoUser.Id, editedTransaction);

        // Assert
        helper.demoUser.Accounts.SelectMany(a => a.Transactions).First(t => t.ID == editedTransaction.ID).Should().BeEquivalentTo(editedTransaction);
    }

    [Fact]
    public async Task UpdateTransactionAsync_WhenTransactionDoesNotExist_ShouldThrowException()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var editedTransaction = new TransactionUpdateRequest
        {
            ID = Guid.NewGuid(),
            Amount = 100.0M,
            Date = DateTime.Now,
            Category = "newCategory",
            Subcategory = "newSubcategory",
            MerchantName = "newMerchantName",
        };

        // Act
        Func<Task> act = async () => await transactionService.UpdateTransactionAsync(helper.demoUser.Id, editedTransaction);

        // Assert
        await act.Should().ThrowAsync<BudgetBoardServiceException>().WithMessage("The transaction you are trying to edit does not exist.");
    }

    [Fact]
    public async Task DeleteTransactionAsync_ShouldDeleteTransaction()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        var transactionFaker = new TransactionFaker() { AccountIds = [account.ID] };
        var transactions = transactionFaker.Generate(5);

        account.Transactions = transactions;

        helper.UserDataContext.Accounts.Add(account);
        helper.UserDataContext.SaveChanges();

        var transactionToDelete = transactions.First();

        // Act
        await transactionService.DeleteTransactionAsync(helper.demoUser.Id, transactionToDelete.ID);

        // Assert
        helper.UserDataContext.Transactions.Single(t => t.ID == transactionToDelete.ID).Deleted.Should().NotBeNull();
    }

    [Fact]
    public async Task DeleteTransactionAsync_WhenTransactionDoesNotExist_ShouldThrowException()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        // Act
        Func<Task> act = async () => await transactionService.DeleteTransactionAsync(helper.demoUser.Id, Guid.NewGuid());

        // Assert
        await act.Should().ThrowAsync<BudgetBoardServiceException>().WithMessage("The transaction you are trying to delete does not exist.");
    }

    [Fact]
    public async Task RestoreTransactionAsync_WhenTransactionIsDeleted_ShouldRestoreTransaction()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        var transactionFaker = new TransactionFaker() { AccountIds = [account.ID] };
        var transactions = transactionFaker.Generate(5);

        account.Transactions = transactions;

        helper.UserDataContext.Accounts.Add(account);
        helper.UserDataContext.SaveChanges();

        var transactionToRestore = transactions.First();
        transactionToRestore.Deleted = DateTime.Now.ToUniversalTime();

        // Act
        await transactionService.RestoreTransactionAsync(helper.demoUser.Id, transactionToRestore.ID);

        // Assert
        helper.UserDataContext.Transactions.Single(t => t.ID == transactionToRestore.ID).Deleted.Should().BeNull();
    }

    [Fact]
    public async Task RestoreTransactionAsync_WhenTransactionDoesNotExist_ShouldThrowException()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        // Act
        Func<Task> act = async () => await transactionService.RestoreTransactionAsync(helper.demoUser.Id, Guid.NewGuid());

        // Assert
        await act.Should().ThrowAsync<BudgetBoardServiceException>().WithMessage("The transaction you are trying to restore does not exist.");
    }

    [Fact]
    public async Task RestoreTransactionAsync_WhenTransactionIsNotDeleted_ShouldNotRestoreTransaction()
    {
        // Arrange
        var helper = new TestHelper();
        var transactionService = new TransactionService(Mock.Of<ILogger<ITransactionService>>(), helper.UserDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        var transactionFaker = new TransactionFaker() { AccountIds = [account.ID] };
        var transactions = transactionFaker.Generate(5);

        account.Transactions = transactions;

        helper.UserDataContext.Accounts.Add(account);
        helper.UserDataContext.SaveChanges();

        var transactionToRestore = transactions.First();

        // Act
        await transactionService.RestoreTransactionAsync(helper.demoUser.Id, transactionToRestore.ID);

        // Assert
        helper.UserDataContext.Transactions.Single(t => t.ID == transactionToRestore.ID).Deleted.Should().BeNull();
    }
}
