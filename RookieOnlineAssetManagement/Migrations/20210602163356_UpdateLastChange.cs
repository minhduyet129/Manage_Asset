using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RookieOnlineAssetManagement.Migrations
{
    public partial class UpdateLastChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastChangeAssignment",
                table: "Assignments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2021, 6, 2, 23, 33, 56, 360, DateTimeKind.Local).AddTicks(6020));

            migrationBuilder.AddColumn<DateTime>(
                name: "LastChangeAsset",
                table: "Assets",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2021, 6, 2, 23, 33, 56, 360, DateTimeKind.Local).AddTicks(3408));

            migrationBuilder.AddColumn<DateTime>(
                name: "LastChangeUser",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2021, 6, 2, 23, 33, 56, 358, DateTimeKind.Local).AddTicks(3702));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastChangeAssignment",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "LastChangeAsset",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "LastChangeUser",
                table: "AspNetUsers");
        }
    }
}
