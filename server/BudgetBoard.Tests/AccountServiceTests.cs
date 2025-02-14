using BudgetBoard.Database.Models;
using BudgetBoard.Service;
using BudgetBoard.Service.Interfaces;
using BudgetBoard.Service.Types;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BudgetBoard.IntegrationTests;

public class AccountServiceTests
{
    [Fact]
    public async void CreateAccountAsync_NewAccount_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var account = new AccountCreateRequest
        {
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false
        };

        // Act
        await accountService.CreateAccountAsync(helper.demoUser.Id, account);

        // Assert
        helper.demoUser.Accounts.Should().HaveCount(1);
        helper.demoUser.Accounts.Single().SyncID.Should().Be(account.SyncID);
        helper.demoUser.Accounts.Single().Name.Should().Be(account.Name);
        helper.demoUser.Accounts.Single().InstitutionID.Should().Be(account.InstitutionID);
        helper.demoUser.Accounts.Single().Type.Should().Be(account.Type);
        helper.demoUser.Accounts.Single().Subtype.Should().Be(account.Subtype);
        helper.demoUser.Accounts.Single().HideTransactions.Should().Be(account.HideTransactions);
        helper.demoUser.Accounts.Single().HideAccount.Should().Be(account.HideAccount);
    }

    [Fact]
    public async void ReadAccountsAsync_ReadAll_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var account = new Account
        {
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            UserID = helper.demoUser.Id
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        // Act
        var result = await accountService.ReadAccountsAsync(helper.demoUser.Id);

        // Assert
        result.Should().HaveCount(1);
        result.Single().SyncID.Should().Be(account.SyncID);
        result.Single().Name.Should().Be(account.Name);
        result.Single().InstitutionID.Should().Be(account.InstitutionID);
        result.Single().Type.Should().Be(account.Type);
        result.Single().Subtype.Should().Be(account.Subtype);
        result.Single().HideTransactions.Should().Be(account.HideTransactions);
        result.Single().HideAccount.Should().Be(account.HideAccount);
    }

    [Fact]
    public async void ReadAccountsAsync_ReadSingle_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var account = new Account
        {
            ID = Guid.NewGuid(),
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            UserID = helper.demoUser.Id
        };
        var secondAccount = new Account
        {
            ID = Guid.NewGuid(),
            SyncID = "syncID2",
            Name = "name2",
            InstitutionID = new Guid(),
            Type = "type2",
            Subtype = "subtype2",
            HideTransactions = false,
            HideAccount = false,
            UserID = helper.demoUser.Id
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.Accounts.Add(secondAccount);
        helper.userDataContext.SaveChanges();

        // Act
        var result = await accountService.ReadAccountsAsync(helper.demoUser.Id, account.ID);

        // Assert
        result.Should().HaveCount(1);
        result.Single().ID.Should().Be(account.ID);
        result.Single().SyncID.Should().Be(account.SyncID);
        result.Single().Name.Should().Be(account.Name);
        result.Single().InstitutionID.Should().Be(account.InstitutionID);
        result.Single().Type.Should().Be(account.Type);
        result.Single().Subtype.Should().Be(account.Subtype);
        result.Single().HideTransactions.Should().Be(account.HideTransactions);
        result.Single().HideAccount.Should().Be(account.HideAccount);
    }

    [Fact]
    public async void ReadAccountsAsync_ReadInvalid_ThrowsError()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var invalidGuid = Guid.NewGuid();
        var account = new Account
        {
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            UserID = helper.demoUser.Id
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        // Act
        var readAccountAct = () => accountService.ReadAccountsAsync(helper.demoUser.Id, invalidGuid);

        // Assert
        await readAccountAct.Should().ThrowAsync<Exception>().WithMessage("The account you are trying to access does not exist.");
    }

    [Fact]
    public async void UpdateAccountAsync_ExistingAccount_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var account = new Account
        {
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            UserID = helper.demoUser.Id
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();
        var editedAccount = new AccountUpdateRequest(account)
        {
            Name = "newName",
            Type = "newType",
            Subtype = "newSubtype",
            HideTransactions = true,
            HideAccount = true
        };

        // Act
        await accountService.UpdateAccountAsync(helper.demoUser.Id, editedAccount);

        // Assert
        account.Name.Should().Be(editedAccount.Name);
        account.Type.Should().Be(editedAccount.Type);
        account.Subtype.Should().Be(editedAccount.Subtype);
        account.HideTransactions.Should().Be(editedAccount.HideTransactions);
        account.HideAccount.Should().Be(editedAccount.HideAccount);
    }

    [Fact]
    public async void UpdateAccountAsync_InvalidAccount_ThrowsError()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var invalidGuid = Guid.NewGuid();
        var account = new Account
        {
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            UserID = helper.demoUser.Id
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();
        var editedAccount = new AccountUpdateRequest(account)
        {
            ID = invalidGuid,
            Name = "newName",
            Type = "newType",
            Subtype = "newSubtype",
            HideTransactions = true,
            HideAccount = true
        };

        // Act
        var updateAccountAct = () => accountService.UpdateAccountAsync(helper.demoUser.Id, editedAccount);

        // Assert
        await updateAccountAct.Should().ThrowAsync<Exception>().WithMessage("The account you are trying to edit does not exist.");
    }

    [Fact]
    public async void DeleteAccountAsync_ExistingAccount_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var account = new Account
        {
            ID = Guid.NewGuid(),
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            UserID = helper.demoUser.Id
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        // Act
        await accountService.DeleteAccountAsync(helper.demoUser, account.ID);

        // Assert
        helper.demoUser.Accounts.Single(a => a.ID.Equals(account.ID)).Deleted.Should().BeCloseTo(DateTime.Now.ToUniversalTime(), TimeSpan.FromMinutes(1));
    }

    [Fact]
    public async void DeleteAccountAsync_InvalidAccount_ThrowsError()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var invalidGuid = Guid.NewGuid();
        var account = new Account
        {
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            UserID = helper.demoUser.Id
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        // Act
        var deleteAccountAct = () => accountService.DeleteAccountAsync(helper.demoUser, invalidGuid);

        // Assert
        await deleteAccountAct.Should().ThrowAsync<Exception>().WithMessage("The account you are trying to delete does not exist.");
    }

    [Fact]
    public async void DeleteAccountAsync_DeleteTransactions_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var account = new Account
        {
            ID = Guid.NewGuid(),
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            UserID = helper.demoUser.Id
        };
        var transaction = new Transaction
        {
            ID = Guid.NewGuid(),
            AccountID = account.ID,
            Amount = 100,
            Date = DateTime.Now,
            Category = "category",
            Subcategory = "subcategory",
            MerchantName = "merchant",
            Pending = false,
            Source = "source",
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.Transactions.Add(transaction);
        helper.userDataContext.SaveChanges();

        // Act
        await accountService.DeleteAccountAsync(helper.demoUser, account.ID, true);

        // Assert
        helper.demoUser.Accounts.Single(a => a.ID.Equals(account.ID)).Deleted.Should().BeCloseTo(DateTime.Now.ToUniversalTime(), TimeSpan.FromMinutes(1));
        helper.demoUser.Accounts.Single(a => a.ID.Equals(account.ID)).Transactions.Single(t => t.ID.Equals(transaction.ID)).Deleted.Should().BeCloseTo(DateTime.Now.ToUniversalTime(), TimeSpan.FromMinutes(1));
    }

    [Fact]
    public async void RestoreAccountAsync_ExistingAccount_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var account = new Account
        {
            ID = Guid.NewGuid(),
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            Deleted = DateTime.Now.ToUniversalTime(),
            UserID = helper.demoUser.Id
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        // Act
        await accountService.RestoreAccountAsync(helper.demoUser, account.ID);

        // Assert
        helper.demoUser.Accounts.Single(a => a.ID.Equals(account.ID)).Deleted.Should().BeNull();
    }

    [Fact]
    public async void RestoreAccountAsync_InvalidAccount_ThrowsError()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var invalidGuid = Guid.NewGuid();
        var account = new Account
        {
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            Deleted = DateTime.Now.ToUniversalTime(),
            UserID = helper.demoUser.Id
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.SaveChanges();

        // Act
        var restoreAccountAct = () => accountService.RestoreAccountAsync(helper.demoUser, invalidGuid);

        // Assert
        await restoreAccountAct.Should().ThrowAsync<Exception>().WithMessage("The account you are trying to restore does not exist.");
    }

    [Fact]
    public async void RestoreAccountAsync_RestoreTransactions_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var account = new Account
        {
            ID = Guid.NewGuid(),
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            Deleted = DateTime.Now.ToUniversalTime(),
            UserID = helper.demoUser.Id
        };
        var transaction = new Transaction
        {
            ID = Guid.NewGuid(),
            AccountID = account.ID,
            Amount = 100,
            Date = DateTime.Now,
            Category = "category",
            Subcategory = "subcategory",
            MerchantName = "merchant",
            Pending = false,
            Source = "source",
            Deleted = DateTime.Now.ToUniversalTime()
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.Transactions.Add(transaction);
        helper.userDataContext.SaveChanges();

        // Act
        await accountService.RestoreAccountAsync(helper.demoUser, account.ID, true);

        // Assert
        helper.demoUser.Accounts.Single(a => a.ID.Equals(account.ID)).Deleted.Should().BeNull();
        helper.demoUser.Accounts.Single(a => a.ID.Equals(account.ID)).Transactions.Single(t => t.ID.Equals(transaction.ID)).Deleted.Should().BeNull();
    }

    [Fact]
    public async void OrderAccountsAsync_ExistingAccounts_HappyPath()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var account = new Account
        {
            ID = Guid.NewGuid(),
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            Index = 0,
            UserID = helper.demoUser.Id
        };
        var secondAccount = new Account
        {
            ID = Guid.NewGuid(),
            SyncID = "syncID2",
            Name = "name2",
            InstitutionID = new Guid(),
            Type = "type2",
            Subtype = "subtype2",
            HideTransactions = false,
            HideAccount = false,
            Index = 1,
            UserID = helper.demoUser.Id
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.Accounts.Add(secondAccount);
        helper.userDataContext.SaveChanges();
        var orderedAccounts = new List<AccountIndexRequest>
        {
            new() { ID = secondAccount.ID, Index = 0 },
            new() { ID = account.ID, Index = 1 }
        };

        // Act
        await accountService.OrderAccountsAsync(helper.demoUser, orderedAccounts);

        // Assert
        helper.demoUser.Accounts.Single(a => a.ID.Equals(account.ID)).Index.Should().Be(1);
        helper.demoUser.Accounts.Single(a => a.ID.Equals(secondAccount.ID)).Index.Should().Be(0);
    }

    [Fact]
    public async void OrderAccountsAsync_InvalidAccount_ThrowsError()
    {
        // Arrange
        var helper = new TestHelper();
        var accountService = new AccountService(Mock.Of<ILogger<IAccountService>>(), helper.userDataContext);
        var invalidGuid = Guid.NewGuid();
        var account = new Account
        {
            ID = Guid.NewGuid(),
            SyncID = "syncID",
            Name = "name",
            InstitutionID = new Guid(),
            Type = "type",
            Subtype = "subtype",
            HideTransactions = false,
            HideAccount = false,
            Index = 0,
            UserID = helper.demoUser.Id
        };
        var secondAccount = new Account
        {
            ID = Guid.NewGuid(),
            SyncID = "syncID2",
            Name = "name2",
            InstitutionID = new Guid(),
            Type = "type2",
            Subtype = "subtype2",
            HideTransactions = false,
            HideAccount = false,
            Index = 1,
            UserID = helper.demoUser.Id
        };
        helper.userDataContext.Accounts.Add(account);
        helper.userDataContext.Accounts.Add(secondAccount);
        helper.userDataContext.SaveChanges();
        var orderedAccounts = new List<AccountIndexRequest>
        {
            new() { ID = secondAccount.ID, Index = 0 },
            new() { ID = invalidGuid, Index = 1 }
        };

        // Act
        var orderAccountsAct = () => accountService.OrderAccountsAsync(helper.demoUser, orderedAccounts);

        // Assert
        await orderAccountsAct.Should().ThrowAsync<Exception>().WithMessage("The account you are trying to set the index for does not exist.");
    }
}