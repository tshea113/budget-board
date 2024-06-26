﻿// <auto-generated />
using System;
using BudgetBoard.Database.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BudgetBoard.Database.Migrations
{
    [DbContext(typeof(UserDataContext))]
    [Migration("20240401020645_AddBudgetsDeleted")]
    partial class AddBudgetsDeleted
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("BudgetBoard.Database.Models.Account", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<float>("CurrentBalance")
                        .HasColumnType("real");

                    b.Property<string>("Institution")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Subtype")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SyncID")
                        .HasColumnType("text");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("UserID")
                        .HasColumnType("uuid");

                    b.HasKey("ID");

                    b.HasIndex("UserID");

                    b.ToTable("Account", (string)null);
                });

            modelBuilder.Entity("BudgetBoard.Database.Models.Budget", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Category")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("Deleted")
                        .HasColumnType("timestamp with time zone");

                    b.Property<float>("Limit")
                        .HasColumnType("real");

                    b.Property<Guid>("UserID")
                        .HasColumnType("uuid");

                    b.HasKey("ID");

                    b.HasIndex("UserID");

                    b.ToTable("Budget", (string)null);
                });

            modelBuilder.Entity("BudgetBoard.Database.Models.Transaction", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("AccountID")
                        .HasColumnType("uuid");

                    b.Property<decimal>("Amount")
                        .HasColumnType("numeric");

                    b.Property<string>("Category")
                        .HasColumnType("text");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("MerchantName")
                        .HasColumnType("text");

                    b.Property<bool>("Pending")
                        .HasColumnType("boolean");

                    b.Property<string>("Source")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Subcategory")
                        .HasColumnType("text");

                    b.Property<string>("SyncID")
                        .HasColumnType("text");

                    b.HasKey("ID");

                    b.HasIndex("AccountID");

                    b.ToTable("Transaction", (string)null);
                });

            modelBuilder.Entity("BudgetBoard.Database.Models.User", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("AccessToken")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("LastSync")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Uid")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ID");

                    b.ToTable("User", (string)null);
                });

            modelBuilder.Entity("BudgetBoard.Database.Models.Account", b =>
                {
                    b.HasOne("BudgetBoard.Database.Models.User", "User")
                        .WithMany("Accounts")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("BudgetBoard.Database.Models.Budget", b =>
                {
                    b.HasOne("BudgetBoard.Database.Models.User", "User")
                        .WithMany("Budgets")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("BudgetBoard.Database.Models.Transaction", b =>
                {
                    b.HasOne("BudgetBoard.Database.Models.Account", "Account")
                        .WithMany("Transactions")
                        .HasForeignKey("AccountID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Account");
                });

            modelBuilder.Entity("BudgetBoard.Database.Models.Account", b =>
                {
                    b.Navigation("Transactions");
                });

            modelBuilder.Entity("BudgetBoard.Database.Models.User", b =>
                {
                    b.Navigation("Accounts");

                    b.Navigation("Budgets");
                });
#pragma warning restore 612, 618
        }
    }
}
