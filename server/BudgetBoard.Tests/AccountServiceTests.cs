using Bogus;
using BudgetBoard.IntegrationTests.Fakers;
using BudgetBoard.Service;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Types;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit.Abstractions;

namespace BudgetBoard.IntegrationTests;

[Collection("IntegrationTests")]
public class AccountServiceTests(ITestOutputHelper testOutputHelper)
{
    private readonly ITestOutputHelper _testOutputHelper = testOutputHelper;

    private readonly Faker<AccountCreateRequest> _accountCreateRequestFaker = new Faker<AccountCreateRequest>()
        .RuleFor(a => a.SyncID, f => f.Random.String(20))
        .RuleFor(a => a.Name, f => f.Finance.AccountName())
        .RuleFor(a => a.InstitutionID, f => Guid.NewGuid())
        .RuleFor(a => a.Type, f => f.Finance.TransactionType())
        .RuleFor(a => a.Subtype, f => f.Finance.TransactionType())
        .RuleFor(a => a.HideTransactions, f => false)
        .RuleFor(a => a.HideAccount, f => false);

    private readonly Faker<AccountUpdateRequest> _accountUpdateRequestFaker = new Faker<AccountUpdateRequest>()
        .RuleFor(a => a.Name, f => f.Finance.AccountName())
        .RuleFor(a => a.Type, f => f.Finance.TransactionType())
        .RuleFor(a => a.Subtype, f => f.Finance.TransactionType())
        .RuleFor(a => a.HideTransactions, f => false)
        .RuleFor(a => a.HideAccount, f => false);

    [Fact]
    public async Task CreateAccountAsync_InvalidUserId_ThrowsError()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var account = _accountCreateRequestFaker.Generate();

        // Act
        var createAccountAct = () => accountService.CreateAccountAsync(Guid.NewGuid(), account);

        // Assert
        await createAccountAct.Should().ThrowAsync<Exception>().WithMessage("Provided user not found.");
    }

    [Fact]
    public async Task CreateAccountAsync_NewAccount_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var account = _accountCreateRequestFaker.Generate();

        // Act
        await accountService.CreateAccountAsync(helper.demoUser.Id, account);

        // Assert
        helper.demoUser.Accounts.Should().HaveCount(1);
        helper.demoUser.Accounts.Single().Should().BeEquivalentTo(account);
    }

    [Fact]
    public async Task ReadAccountsAsync_ReadAll_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        // Act
        var result = await accountService.ReadAccountsAsync(helper.demoUser.Id);

        // Assert
        result.Should().HaveCount(1);
        result.Single().Should().BeEquivalentTo(new AccountResponse(account));
    }

    [Fact]
    public async Task ReadAccountsAsync_ReadSingle_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;
        var secondAccount = accountFaker.Generate();
        secondAccount.UserID = helper.demoUser.Id;

        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.Accounts.Add(secondAccount);
        helper.userDataContext.SaveChanges();

        // Act
        var result = await accountService.ReadAccountsAsync(helper.demoUser.Id, account.ID);

        // Assert
        result.Should().HaveCount(1);
        result.Single().Should().BeEquivalentTo(new AccountResponse(account));
    }

    [Fact]
    public async Task ReadAccountsAsync_ReadInvalid_ThrowsError()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        var invalidGuid = Guid.NewGuid();

        // Act
        var readAccountAct = () => accountService.ReadAccountsAsync(helper.demoUser.Id, invalidGuid);

        // Assert
        await readAccountAct.Should().ThrowAsync<Exception>().WithMessage("The account you are trying to access does not exist.");
    }

    [Fact]
    public async Task UpdateAccountAsync_ExistingAccount_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        var editedAccount = _accountUpdateRequestFaker.Generate();
        editedAccount.ID = account.ID;

        // Act
        await accountService.UpdateAccountAsync(helper.demoUser.Id, editedAccount);

        // Assert
        account.Should().BeEquivalentTo(editedAccount);
    }

    [Fact]
    public async Task UpdateAccountAsync_InvalidAccount_ThrowsError()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        var editedAccount = _accountUpdateRequestFaker.Generate();

        var invalidGuid = Guid.NewGuid();

        // Act
        var updateAccountAct = () => accountService.UpdateAccountAsync(helper.demoUser.Id, editedAccount);

        // Assert
        await updateAccountAct.Should().ThrowAsync<Exception>().WithMessage("The account you are trying to edit does not exist.");
    }

    [Fact]
    public async Task DeleteAccountAsync_ExistingAccount_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        // Act
        await accountService.DeleteAccountAsync(helper.demoUser.Id, account.ID);

        // Assert
        helper.demoUser.Accounts.Single(a => a.ID == account.ID).Deleted.Should().BeCloseTo(DateTime.Now.ToUniversalTime(), TimeSpan.FromMinutes(1));
    }

    [Fact]
    public async Task DeleteAccountAsync_InvalidAccount_ThrowsError()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var invalidGuid = Guid.NewGuid();

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        // Act
        var deleteAccountAct = () => accountService.DeleteAccountAsync(helper.demoUser.Id, invalidGuid);

        // Assert
        await deleteAccountAct.Should().ThrowAsync<Exception>().WithMessage("The account you are trying to delete does not exist.");
    }

    [Fact]
    public async Task DeleteAccountAsync_DeleteTransactions_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;

        var transactionFaker = new TransactionFaker();
        transactionFaker.AccountIds.Add(account.ID);
        var transaction = transactionFaker.Generate();
        transaction.AccountID = account.ID;

        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.Transactions.Add(transaction);
        helper.userDataContext.SaveChanges();

        // Act
        await accountService.DeleteAccountAsync(helper.demoUser.Id, account.ID, true);

        // Assert
        helper.demoUser.Accounts.Single(a => a.ID == account.ID).Deleted.Should().BeCloseTo(DateTime.Now.ToUniversalTime(), TimeSpan.FromMinutes(1));
        helper.demoUser.Accounts.Single(a => a.ID == account.ID).Transactions.Single(t => t.ID == transaction.ID).Deleted.Should().BeCloseTo(DateTime.Now.ToUniversalTime(), TimeSpan.FromMinutes(1));
    }

    [Fact]
    public async Task RestoreAccountAsync_ExistingAccount_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;
        account.Deleted = DateTime.Now.ToUniversalTime();

        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        // Act
        await accountService.RestoreAccountAsync(helper.demoUser.Id, account.ID);

        // Assert
        helper.demoUser.Accounts.Single(a => a.ID == account.ID).Deleted.Should().BeNull();
    }

    [Fact]
    public async Task RestoreAccountAsync_InvalidAccount_ThrowsError()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;
        account.Deleted = DateTime.Now.ToUniversalTime();

        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        var invalidGuid = Guid.NewGuid();

        // Act
        var restoreAccountAct = () => accountService.RestoreAccountAsync(helper.demoUser.Id, invalidGuid);

        // Assert
        await restoreAccountAct.Should().ThrowAsync<Exception>().WithMessage("The account you are trying to restore does not exist.");
    }

    [Fact]
    public async Task RestoreAccountAsync_RestoreTransactions_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);

        var accountFaker = new AccountFaker();
        var account = accountFaker.Generate();
        account.UserID = helper.demoUser.Id;
        account.Deleted = DateTime.Now.ToUniversalTime();

        var transactionFaker = new TransactionFaker();
        transactionFaker.AccountIds.Add(account.ID);
        var transaction = transactionFaker.Generate();

        transaction.Deleted = DateTime.Now.ToUniversalTime();

        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.Transactions.Add(transaction);
        helper.userDataContext.SaveChanges();

        // Act
        await accountService.RestoreAccountAsync(helper.demoUser.Id, account.ID, true);

        // Assert
        helper.demoUser.Accounts.Single(a => a.ID == account.ID).Deleted.Should().BeNull();
        helper.demoUser.Accounts.Single(a => a.ID == account.ID).Transactions.Single(t => t.ID == transaction.ID).Deleted.Should().BeNull();
    }

    [Fact]
    public async Task OrderAccountsAsync_ExistingAccounts_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);

        var randomNumberBetween1And10 = new Random().Next(1, 10);
        _testOutputHelper.WriteLine($"Number of accounts: {randomNumberBetween1And10}");

        var accountFaker = new AccountFaker();
        var accounts = accountFaker.Generate(randomNumberBetween1And10);
        foreach (var account in accounts)
        {
            account.UserID = helper.demoUser.Id;
        }

        helper.userDataContext.Accounts.AddRange(accounts);
        helper.userDataContext.SaveChanges();

        List<IAccountIndexRequest> orderedAccounts = [];
        foreach (var account in accounts)
        {
            orderedAccounts.Add(new AccountIndexRequest { ID = account.ID, Index = accounts.IndexOf(account) });
        }

        // Act
        await accountService.OrderAccountsAsync(helper.demoUser.Id, orderedAccounts);

        // Assert
        foreach (var account in accounts)
        {
            helper.demoUser.Accounts.Single(a => a.ID == account.ID).Should().BeEquivalentTo(account);
        }
    }

    [Fact]
    public async Task OrderAccountsAsync_InvalidAccount_ThrowsError()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);

        var randomNumberBetween1And10 = new Random().Next(1, 10);
        _testOutputHelper.WriteLine($"Number of accounts: {randomNumberBetween1And10}");

        var accountFaker = new AccountFaker();
        var accounts = accountFaker.Generate(randomNumberBetween1And10);
        foreach (var account in accounts)
        {
            account.UserID = helper.demoUser.Id;
        }

        helper.userDataContext.Accounts.AddRange(accounts);
        helper.userDataContext.SaveChanges();

        List<IAccountIndexRequest> orderedAccounts = [];
        foreach (var account in accounts)
        {
            orderedAccounts.Add(new AccountIndexRequest { ID = account.ID, Index = accounts.IndexOf(account) });
        }

        var invalidGuid = Guid.NewGuid();
        orderedAccounts.Add(new AccountIndexRequest { ID = invalidGuid, Index = accounts.Count });

        // Act
        var orderAccountsAct = () => accountService.OrderAccountsAsync(helper.demoUser.Id, orderedAccounts);

        // Assert
        await orderAccountsAct.Should().ThrowAsync<Exception>().WithMessage("The account you are trying to set the index for does not exist.");
    }
}