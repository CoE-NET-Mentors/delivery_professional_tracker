using DPTracker.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace DPTracker.Services.Data
{
    public class DPTrackerDbContext : DbContext
    {
        public DbSet<Mentor> Mentors { get; set; }
        public DbSet<DeliveryProfessional> DeliveryProfessionals { get; set; }
        public DbSet<Mentee> Mentees { get; set; }
        public DbSet<DeliveryProfessionalRecord> DeliveryProfessionalRecords { get; set; }

        public DbSet<RecordNote> RecordNotes { get; set; }
        public DPTrackerDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<Mentor>().HasMany<Mentee>().WithOne(m => m.Mentor).OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder.Entity<Mentee>().HasKey(m => new { m.Id, m.MentorId });

            modelBuilder.Entity<RecordNote>().HasKey(rn => new { rn.DeliveryProfessionalRecordId, rn.CreatedAt });
        }
    }
}
