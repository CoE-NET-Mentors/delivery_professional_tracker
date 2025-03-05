using DPTracker.Models.Data;
using DPTracker.Models.Response;
using DPTracker.Services;
using DPTracker.Services.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;

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
            var mentor = await _dbContext.Mentors.Include(m => m.DeliveryProfessional).FirstOrDefaultAsync(m => m.Id == user.Id);
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
                var mentor = _dbContext.Mentors.Find(userId);
                var response = new FetchAll();
                if (mentor != null)
                {
                    response.Mentees = new FetchMentees(await _dbContext.Mentees.Include(dp => dp.DeliveryProfessional).Where(m => m.MentorId == mentor.Id).ToListAsync());

                }
                response.DeliveryProfessionals = new FetchDeliveryProfessionals(await _dbContext.DeliveryProfessionals.AsNoTracking().ToListAsync());
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
                response = users.Where(u => u.DisplayName.Contains(searchTerm) || u.Email.Contains(searchTerm)).Select(r => new Models.Response.DeliveryProfessional(r.Id, r.DisplayName, r.Email)).ToList();
            }
            return Ok(response);
        }
    }
}