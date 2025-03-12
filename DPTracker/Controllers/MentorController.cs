using DPTracker.Models.Data;
using DPTracker.Models.Request;
using DPTracker.Models.Response;
using DPTracker.Services;
using DPTracker.Services.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Mentee = DPTracker.Models.Data.Mentee;

namespace DPTracker.Controllers
{
    [Authorize, Route("api/mentor"), AuthorizeForScopes(Scopes = new[] { "user.readbasic.all" })]
    public class MentorController : Controller
    {
        private readonly GraphService _graphService;
        private readonly DPTrackerDbContext _dbContext;

        public MentorController(GraphService graphService, DPTrackerDbContext dbContext)
        {
            _graphService = graphService;
            _dbContext = dbContext;
        }

        // POST: api/mentor/register
        [HttpPost("register")]
        public async Task<ActionResult> Register()
        {
            var user = await _graphService.GetMeAsync();
            var mentor = await _dbContext.Mentors.Include(m => m.DeliveryProfessional)
                .FirstOrDefaultAsync(m => m.Id == user.Id);
            if (mentor == null)
            {
                var dp = await _dbContext.DeliveryProfessionals.FindAsync(user.Id);
                if (dp == null)
                {
                    dp = user;
                    await _dbContext.DeliveryProfessionals.AddAsync(dp);
                }

                mentor = new Mentor
                {
                    Id = dp.Id,
                    DeliveryProfessional = dp
                };
                await _dbContext.Mentors.AddAsync(mentor);
                await _dbContext.SaveChangesAsync();
            }

            return Created(string.Empty, new MentorRegister(mentor));
        }

        // GET: api/mentor/mentees
        [HttpGet("mentees")]
        public async Task<ActionResult> FetchMentees()
        {
            //User.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier");
            var objectId = User.GetObjectId();
            if (Guid.TryParse(objectId, out Guid userId))
            {
                var mentor = await _graphService.GetMentorByDeliveryProfessionalIdAsync(userId);
                var response = new FetchAll();
        
                if (mentor != null)
                {
                    var mentees = await _graphService.GetMenteesByMentorIdAsync(mentor.Id);
                    response.Mentees = new FetchMentees(mentees);
                }
                
                var deliveryProfessionals = await _graphService.GetAllDeliveryProfessionalsAsync();
                response.DeliveryProfessionals = new FetchDeliveryProfessionals(deliveryProfessionals);
                return Ok(response);
            }

            return BadRequest();
        }

        [HttpGet("dpsearch")]
        public async Task<ActionResult> DeliveryProfessionalSearch([FromQuery] string searchTerm = "")
        {
            var response = new List<Models.Response.DeliveryProfessional>();
            if (!string.IsNullOrEmpty(searchTerm) && searchTerm.Length >= 3)
            {
                var users = await _graphService.GetAllASync();
                response = users.Where(u => u.DisplayName.Contains(searchTerm) || u.Email.Contains(searchTerm))
                    .Select(r => new Models.Response.DeliveryProfessional(r.Id, r.DisplayName, r.Email)).ToList();
            }

            return Ok(response);
        }

        // POST: api/mentor/mentees/{deliveryProfessionalId}
        [HttpPost("mentees/{deliveryProfessionalId}")]
        public async Task<ActionResult> AddMenteeToMentor(Guid deliveryProfessionalId)
        {
            var mentorId = User.GetObjectId();
            if (Guid.TryParse(mentorId, out Guid mentorGuid))
            {
                var result = await _graphService.AddMenteeAsync(mentorGuid, deliveryProfessionalId);
                if (!result)
                    return NotFound();
                return Ok();
            }
            return BadRequest();
        }

        // DELETE: api/mentor/mentees/{deliveryProfessionalId}
        [HttpDelete("mentees/{deliveryProfessionalId}")]
        public async Task<ActionResult> DeleteMentee(Guid deliveryProfessionalId)
        {
            var mentorId = User.GetObjectId();
            if (Guid.TryParse(mentorId, out Guid mentorGuid))
            {
                var mentor = await _graphService.GetMentorByDeliveryProfessionalIdAsync(mentorGuid);
                if (mentor == null) return NotFound();
                var mentees = await _graphService.GetMenteesByMentorIdAsync(mentor.Id);
                if (mentees.FirstOrDefault(x => x.DeliveryProfessionalId == deliveryProfessionalId) == null) return NotFound();
                var result = await _graphService.DeleteMentee(deliveryProfessionalId, mentor.Id);
                if (!result) return NotFound();
                return Ok();
            }

            return BadRequest();
        }

        // GET: api/mentor/mentees/{menteeId}/records
        [HttpGet("mentees/{menteeId}/records")]
        public async Task<ActionResult> GetMenteeRecords(Guid menteeId)
        {
            var records = await _graphService.GetRecordsByProfessionalIdAsync(menteeId);
            return Ok(records);
        }

        // POST: api/mentor/mentees/{menteeId}/records
        [HttpPost("mentees/{menteeId}/records")]
        public async Task<ActionResult> AddMenteeRecord(Guid menteeId, [FromBody] CreateNewRecord record)
        {
            var records = await _graphService.AddMenteeRecord(menteeId, record);
            return Ok(records);
        }

        // PUT: api/mentor/mentees/{menteeId}/records/{recordId}
        [HttpPut("mentees/{menteeId}/records/{recordId}")]
        public async Task<ActionResult> UpdateMenteeRecord(Guid menteeId, Guid recordId,
            [FromBody] CreateNewRecord record)
        {
            var records = await _graphService.UpdateMenteeRecord(menteeId, recordId, record);
            if (records.Count == 0) return NotFound();
            return Ok(records);
        }

        // DELETE: api/mentor/mentees/{menteeId}/records/{recordId}
        [HttpDelete("mentees/{menteeId}/records/{recordId}")]
        public async Task<ActionResult> DeleteMenteeRecord(Guid menteeId, Guid recordId)
        {
            var records = await _graphService.DeleteMenteeRecord(menteeId, recordId);
            if (records.Count == 0) return NotFound();
            return Ok(records);
        }
    }
}