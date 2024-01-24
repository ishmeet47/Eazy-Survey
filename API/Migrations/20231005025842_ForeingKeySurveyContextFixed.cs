using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class ForeingKeySurveyContextFixed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyAnswers_SurveyOptions_OptionId",
                table: "SurveyAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyAnswers_Users_UserId",
                table: "SurveyAnswers");

            migrationBuilder.DropColumn(
                name: "LastUpdatedBy",
                table: "SurveyOptions");

            migrationBuilder.DropColumn(
                name: "LastUpdatedOn",
                table: "SurveyOptions");

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Surveys",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "SurveyQuestions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "SurveyOptions",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("SqlServer:Identity", "1, 1")
                .OldAnnotation("Relational:ColumnOrder", 0)
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "SurveyAnswers",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("Relational:ColumnOrder", 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "SurveyAnswers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "SurveyOptionId",
                table: "SurveyAnswers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SurveyQuestionId",
                table: "SurveyAnswers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Groups",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_SurveyAnswers_SurveyOptionId",
                table: "SurveyAnswers",
                column: "SurveyOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyAnswers_SurveyQuestionId",
                table: "SurveyAnswers",
                column: "SurveyQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyAnswers_SurveyOptions_OptionId",
                table: "SurveyAnswers",
                column: "OptionId",
                principalTable: "SurveyOptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyAnswers_SurveyOptions_SurveyOptionId",
                table: "SurveyAnswers",
                column: "SurveyOptionId",
                principalTable: "SurveyOptions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyAnswers_SurveyQuestions_SurveyQuestionId",
                table: "SurveyAnswers",
                column: "SurveyQuestionId",
                principalTable: "SurveyQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyAnswers_Users_UserId",
                table: "SurveyAnswers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyAnswers_SurveyOptions_OptionId",
                table: "SurveyAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyAnswers_SurveyOptions_SurveyOptionId",
                table: "SurveyAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyAnswers_SurveyQuestions_SurveyQuestionId",
                table: "SurveyAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyAnswers_Users_UserId",
                table: "SurveyAnswers");

            migrationBuilder.DropIndex(
                name: "IX_SurveyAnswers_SurveyOptionId",
                table: "SurveyAnswers");

            migrationBuilder.DropIndex(
                name: "IX_SurveyAnswers_SurveyQuestionId",
                table: "SurveyAnswers");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Surveys");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "SurveyQuestions");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "SurveyAnswers");

            migrationBuilder.DropColumn(
                name: "SurveyOptionId",
                table: "SurveyAnswers");

            migrationBuilder.DropColumn(
                name: "SurveyQuestionId",
                table: "SurveyAnswers");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Groups");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "SurveyOptions",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("Relational:ColumnOrder", 0)
                .Annotation("SqlServer:Identity", "1, 1")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "LastUpdatedBy",
                table: "SurveyOptions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdatedOn",
                table: "SurveyOptions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "SurveyAnswers",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("Relational:ColumnOrder", 0);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyAnswers_SurveyOptions_OptionId",
                table: "SurveyAnswers",
                column: "OptionId",
                principalTable: "SurveyOptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyAnswers_Users_UserId",
                table: "SurveyAnswers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
