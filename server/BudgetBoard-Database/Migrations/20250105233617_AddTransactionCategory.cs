using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetBoard.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Category_User_UserID",
                table: "Category");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Category",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "Label",
                table: "Category");

            migrationBuilder.RenameTable(
                name: "Category",
                newName: "TransactionCategory");

            migrationBuilder.RenameIndex(
                name: "IX_Category_UserID",
                table: "TransactionCategory",
                newName: "IX_TransactionCategory_UserID");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "TransactionCategory",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TransactionCategory",
                table: "TransactionCategory",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionCategory_User_UserID",
                table: "TransactionCategory",
                column: "UserID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TransactionCategory_User_UserID",
                table: "TransactionCategory");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TransactionCategory",
                table: "TransactionCategory");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "TransactionCategory");

            migrationBuilder.RenameTable(
                name: "TransactionCategory",
                newName: "Category");

            migrationBuilder.RenameIndex(
                name: "IX_TransactionCategory_UserID",
                table: "Category",
                newName: "IX_Category_UserID");

            migrationBuilder.AddColumn<string>(
                name: "Label",
                table: "Category",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Category",
                table: "Category",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Category_User_UserID",
                table: "Category",
                column: "UserID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
