using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetBoard.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBudgetFloatToDecimal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Limit",
                table: "Budget",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "Limit",
                table: "Budget",
                type: "real",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");
        }
    }
}
