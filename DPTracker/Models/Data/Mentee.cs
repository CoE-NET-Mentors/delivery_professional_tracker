using Microsoft.EntityFrameworkCore;

namespace DPTracker.Models.Data
{

    public class Mentee
    {        
        public Guid Id { get; set; }
        public Guid MentorId { get; set; }
        
        public Guid DeliveryProfessionalId { get; set; }
        
        [DeleteBehavior(DeleteBehavior.NoAction)]
        public Mentor Mentor { get; set; } = null!;

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public DeliveryProfessional DeliveryProfessional { get; set; } = null!;
    }
}
