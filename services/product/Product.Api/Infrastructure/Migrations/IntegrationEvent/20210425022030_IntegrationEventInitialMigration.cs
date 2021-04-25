using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Product.Api.Infrastructure.Migrations.IntegrationEvent
{
    public partial class IntegrationEventInitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "integrationeventlogs",
                columns: table => new
                {
                    eventid = table.Column<Guid>(type: "uuid", nullable: false),
                    eventtypename = table.Column<string>(type: "text", nullable: false),
                    state = table.Column<int>(type: "integer", nullable: false),
                    timessent = table.Column<int>(type: "integer", nullable: false),
                    creationtime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_integrationeventlogs", x => x.eventid);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "integrationeventlogs");
        }
    }
}
