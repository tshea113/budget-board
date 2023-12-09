using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MoneyMinder.Data.Migrations
{
    /// <inheritdoc />
    public partial class fixUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "id",
                table: "Users",
                newName: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "id");
        }
    }
}
