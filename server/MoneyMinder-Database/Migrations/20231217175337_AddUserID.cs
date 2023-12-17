using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoneyMinder.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddUserID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Account_User_UserID",
                table: "Account");

            migrationBuilder.AlterColumn<int>(
                name: "UserID",
                table: "Account",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Account_User_UserID",
                table: "Account",
                column: "UserID",
                principalTable: "User",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Account_User_UserID",
                table: "Account");

            migrationBuilder.AlterColumn<int>(
                name: "UserID",
                table: "Account",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Account_User_UserID",
                table: "Account",
                column: "UserID",
                principalTable: "User",
                principalColumn: "ID");
        }
    }
}
