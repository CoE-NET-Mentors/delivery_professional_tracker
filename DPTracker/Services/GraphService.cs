using DPTracker.Extensions;
using DPTracker.Models.Data;
using DPTracker.Services.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;

namespace DPTracker.Services
{
    public class DPListCache
    {
        private readonly DateTime _lastFetch;
        private readonly List<Models.Data.DeliveryProfessional> _deliveryProfessionals;

        public DPListCache()
        {
            _deliveryProfessionals = new List<Models.Data.DeliveryProfessional>();
            _lastFetch = DateTime.MinValue;
        }

        public async Task<List<Models.Data.DeliveryProfessional>> GetAll(GraphService graphService)
        {
            if (_lastFetch <= DateTime.UtcNow)
            {
                _deliveryProfessionals.Clear();
                _deliveryProfessionals.AddRange(await graphService.GetAllASync());
            }
            return _deliveryProfessionals;
        }
    }

    public class GraphService
    {
        private readonly GraphServiceClient _graphServiceClient;
        private readonly DPTrackerDbContext _dbContext;

        public GraphService(GraphServiceClient graphServiceClient, DPTrackerDbContext dbContext)
        {
            _graphServiceClient = graphServiceClient;
            _dbContext = dbContext;
        }

        public async Task<Models.Data.DeliveryProfessional> GetMeAsync()
        {
            var me = await _graphServiceClient.Me.GetAsync();
            return new Models.Data.DeliveryProfessional
            {
                Id = Guid.Parse(me?.Id!),
                DisplayName = me?.DisplayName!,
                Email = me?.Mail!
            };
        }

        public async Task<List<Models.Data.DeliveryProfessional>> GetAllDeliveryProfessionalsAsync()
        {
            return await _dbContext.DeliveryProfessionals
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<Models.Data.DeliveryProfessional>> GetAllASync()
        {
            var response = new List<Models.Data.DeliveryProfessional>();
            var all = await _graphServiceClient.GetAllUsersAsync();
            foreach (var user in all)
            {
                response.Add(new Models.Data.DeliveryProfessional
                {
                    Id = Guid.Parse(user?.Id!),
                    DisplayName = user?.DisplayName!,
                    Email = user?.Mail!
                });
            }
            return response;
        }

        public async Task<Models.Data.Mentor?> GetMentorByDeliveryProfessionalIdAsync(Guid deliveryProfessionalId)
        {
            return await _dbContext.Mentors
                .FirstOrDefaultAsync(m => m.DeliveryProfessionalId == deliveryProfessionalId);
        }

        public async Task<List<Models.Data.Mentee>> GetMenteesByMentorIdAsync(Guid mentorId)
        {
            var mentees = await _dbContext.Mentees
                .Where(m => m.MentorId == mentorId)
                .Include(m => m.DeliveryProfessional)
                .ToListAsync();
            return mentees;
        }

        public async Task<bool> AddMenteeAsync(Guid mentorId, Guid deliveryProfessionalId)
        {
            var mentor = await _dbContext.Mentors.FirstOrDefaultAsync(x => x.DeliveryProfessionalId == mentorId);
            var deliveryProfessional =
                await _dbContext.DeliveryProfessionals.FirstOrDefaultAsync(x => x.Id == deliveryProfessionalId);
            if (mentor == null || deliveryProfessional == null)
            {
                Console.WriteLine($"MentorId: {mentorId}, Found: {(mentor == null ? "NULL" : "YES")}");
                Console.WriteLine(
                    $"DeliveryProfessionalId: {deliveryProfessionalId}, Found: {(deliveryProfessional == null ? "NULL" : "YES")}");
                return false;
            }

            var mentee = new Mentee
            {
                Id = Guid.NewGuid(),
                Mentor = mentor,
                MentorId = mentor.Id,
                DeliveryProfessional = deliveryProfessional,
                DeliveryProfessionalId = deliveryProfessionalId
            };
            await _dbContext.Mentees.AddAsync(mentee);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMentee(Guid menteeId, Guid mentorId)
        {
            var mentee = await _dbContext.Mentees.FirstOrDefaultAsync(x =>
                x.DeliveryProfessionalId == menteeId && x.MentorId == mentorId);
            if (mentee == null) return false;
            _dbContext.Remove(mentee);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<Models.Response.DeliveryProfessionalRecord>> GetRecordsByProfessionalIdAsync(
            Guid deliveryProfessionalId)
        {
            var records = await _dbContext.DeliveryProfessionalRecords
                .Where(r => r.DeliveryProfessionalId == deliveryProfessionalId)
                .Include(r => r.DeliveryProfessional)
                .Include(r => r.RecordNotes)
                .ToListAsync();

            var responseRecords = records.Select(r => new Models.Response.DeliveryProfessionalRecord
            {
                Id = r.Id,
                CreatedBy = r.CreatedBy,
                DeliveryProfessionalId = r.DeliveryProfessionalId,
                DateAssigned = r.DateAssigned,
                DateCompleted = r.DateCompleted,
                RecordType = r.RecordType,
                RecordNotes = r.RecordNotes.Select(n => new Models.Response.RecordNote
                {
                    DeliveryProfessionalRecordId = n.DeliveryProfessionalRecordId,
                    CreatedAt = n.CreatedAt,
                    CreatedBy = n.CreatedBy,
                    Note = n.Note
                }).ToList()
            }).ToList();

            return responseRecords;
        }

        public async Task<List<Models.Response.DeliveryProfessionalRecord>> AddMenteeRecord(Guid menteeId,
            Models.Request.CreateNewRecord record)
        {
            var deliveryProfessional =
                await _dbContext.DeliveryProfessionals.FirstOrDefaultAsync(x => x.Id == record.DeliveryProfessionalId);

            if (deliveryProfessional == null)
            {
                Console.WriteLine($"ERROR: Delivery professional with ID {record.DeliveryProfessionalId} not found");
                return await GetRecordsByProfessionalIdAsync(menteeId);
            }

            var newId = Guid.NewGuid();
            var newRecord = new DeliveryProfessionalRecord
            {
                Id = newId,
                CreatedBy = record.CreatedBy,
                DeliveryProfessionalId = record.DeliveryProfessionalId,
                DateAssigned = record.DateAssigned,
                DateCompleted = record.DateCompleted,
                RecordType = (RecordType)record.RecordTypeId,
                DeliveryProfessional = deliveryProfessional,
                RecordNotes = []
            };
            var notes = record.RecordNotes.Select(rn => new RecordNote
            {
                DeliveryProfessionalRecordId = newRecord.Id,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = record.CreatedBy,
                Note = rn.Note
            }).ToList();

            newRecord.RecordNotes.AddRange(notes);
            await _dbContext.DeliveryProfessionalRecords.AddAsync(newRecord);
            await _dbContext.SaveChangesAsync();
            return await GetRecordsByProfessionalIdAsync(menteeId);
        }

        public async Task<List<Models.Response.DeliveryProfessionalRecord>> UpdateMenteeRecord(Guid deliveryProfessionalId,
            Guid recordId, Models.Request.CreateNewRecord record)
        {
            var existingRecord = await _dbContext.DeliveryProfessionalRecords
                .Include(r => r.RecordNotes)
                .FirstOrDefaultAsync(r => r.Id == recordId && r.DeliveryProfessionalId == deliveryProfessionalId);
            if (existingRecord == null)
            {
                Console.WriteLine($"ERROR: Record with ID {recordId} not found for delivery professional {deliveryProfessionalId}");
                return await GetRecordsByProfessionalIdAsync(deliveryProfessionalId);
            }
            existingRecord.CreatedBy = record.CreatedBy;
            existingRecord.DateAssigned = record.DateAssigned;
            existingRecord.DateCompleted = record.DateCompleted;
            existingRecord.RecordType = (RecordType)record.RecordTypeId;
            _dbContext.RecordNotes.RemoveRange(existingRecord.RecordNotes);
            existingRecord.RecordNotes.Clear();
            var newNotes = record.RecordNotes.Select(rn => new RecordNote
            {
                DeliveryProfessionalRecordId = existingRecord.Id,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = record.CreatedBy,
                Note = rn.Note
            }).ToList();
            existingRecord.RecordNotes = newNotes;
            await _dbContext.SaveChangesAsync();
            return await GetRecordsByProfessionalIdAsync(deliveryProfessionalId);
        }

        public async Task<List<Models.Response.DeliveryProfessionalRecord>> DeleteMenteeRecord(Guid menteeId,
            Guid recordId)
        {
            var recordToDelete = await _dbContext.DeliveryProfessionalRecords
                .Include(r => r.RecordNotes)
                .FirstOrDefaultAsync(r => r.Id == recordId && r.DeliveryProfessionalId == menteeId);
            if (recordToDelete == null)
            {
                Console.WriteLine($"ERROR: Record with ID {recordId} not found for delivery professional {menteeId}");
                var originalRecords = await GetRecordsByProfessionalIdAsync(menteeId);
                return originalRecords;
            }
            _dbContext.DeliveryProfessionalRecords.Remove(recordToDelete);
            await _dbContext.SaveChangesAsync();
            var records = await GetRecordsByProfessionalIdAsync(menteeId);
            return records;
        }
    }
}