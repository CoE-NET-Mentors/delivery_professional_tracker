using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DPTracker.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DeliveryProfessionals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(254)", maxLength: 254, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(254)", maxLength: 254, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeliveryProfessionals", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DeliveryProfessionalRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeliveryProfessionalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DateAssigned = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateCompleted = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RecordType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeliveryProfessionalRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeliveryProfessionalRecords_DeliveryProfessionals_DeliveryProfessionalId",
                        column: x => x.DeliveryProfessionalId,
                        principalTable: "DeliveryProfessionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Mentors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeliveryProfessionalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mentors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Mentors_DeliveryProfessionals_DeliveryProfessionalId",
                        column: x => x.DeliveryProfessionalId,
                        principalTable: "DeliveryProfessionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecordNotes",
                columns: table => new
                {
                    DeliveryProfessionalRecordId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecordNotes", x => new { x.DeliveryProfessionalRecordId, x.CreatedAt });
                    table.ForeignKey(
                        name: "FK_RecordNotes_DeliveryProfessionalRecords_DeliveryProfessionalRecordId",
                        column: x => x.DeliveryProfessionalRecordId,
                        principalTable: "DeliveryProfessionalRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Mentees",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MentorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeliveryProfessionalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mentees", x => new { x.Id, x.MentorId });
                    table.ForeignKey(
                        name: "FK_Mentees_DeliveryProfessionals_DeliveryProfessionalId",
                        column: x => x.DeliveryProfessionalId,
                        principalTable: "DeliveryProfessionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Mentees_Mentors_MentorId",
                        column: x => x.MentorId,
                        principalTable: "Mentors",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryProfessionalRecords_DeliveryProfessionalId",
                table: "DeliveryProfessionalRecords",
                column: "DeliveryProfessionalId");

            migrationBuilder.CreateIndex(
                name: "IX_Mentees_DeliveryProfessionalId",
                table: "Mentees",
                column: "DeliveryProfessionalId");

            migrationBuilder.CreateIndex(
                name: "IX_Mentees_MentorId",
                table: "Mentees",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_Mentors_DeliveryProfessionalId",
                table: "Mentors",
                column: "DeliveryProfessionalId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Mentees");

            migrationBuilder.DropTable(
                name: "RecordNotes");

            migrationBuilder.DropTable(
                name: "Mentors");

            migrationBuilder.DropTable(
                name: "DeliveryProfessionalRecords");

            migrationBuilder.DropTable(
                name: "DeliveryProfessionals");
        }
    }
}
