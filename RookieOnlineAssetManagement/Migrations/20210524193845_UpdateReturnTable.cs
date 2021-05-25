using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RookieOnlineAssetManagement.Migrations
{
    public partial class UpdateReturnTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReturnRequests_AspNetUsers_ApplicationUserId",
                table: "ReturnRequests");

            migrationBuilder.DropColumn(
                name: "AssignedDate",
                table: "ReturnRequests");

            migrationBuilder.RenameColumn(
                name: "ApplicationUserId",
                table: "ReturnRequests",
                newName: "RequestedByUserId");

            migrationBuilder.RenameIndex(
                name: "IX_ReturnRequests_ApplicationUserId",
                table: "ReturnRequests",
                newName: "IX_ReturnRequests_RequestedByUserId");

            migrationBuilder.AddColumn<int>(
                name: "AcceptedByUserId",
                table: "ReturnRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ReturnRequests_AcceptedByUserId",
                table: "ReturnRequests",
                column: "AcceptedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ReturnRequests_AspNetUsers_AcceptedByUserId",
                table: "ReturnRequests",
                column: "AcceptedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ReturnRequests_AspNetUsers_RequestedByUserId",
                table: "ReturnRequests",
                column: "RequestedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReturnRequests_AspNetUsers_AcceptedByUserId",
                table: "ReturnRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_ReturnRequests_AspNetUsers_RequestedByUserId",
                table: "ReturnRequests");

            migrationBuilder.DropIndex(
                name: "IX_ReturnRequests_AcceptedByUserId",
                table: "ReturnRequests");

            migrationBuilder.DropColumn(
                name: "AcceptedByUserId",
                table: "ReturnRequests");

            migrationBuilder.RenameColumn(
                name: "RequestedByUserId",
                table: "ReturnRequests",
                newName: "ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_ReturnRequests_RequestedByUserId",
                table: "ReturnRequests",
                newName: "IX_ReturnRequests_ApplicationUserId");

            migrationBuilder.AddColumn<DateTime>(
                name: "AssignedDate",
                table: "ReturnRequests",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddForeignKey(
                name: "FK_ReturnRequests_AspNetUsers_ApplicationUserId",
                table: "ReturnRequests",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
