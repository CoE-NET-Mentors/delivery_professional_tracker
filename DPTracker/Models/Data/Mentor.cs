namespace DPTracker.Models.Data
{
    public class Mentor
    {        
        public Guid Id { get; set; }        
        public Guid DeliveryProfessionalId { get; set; }
        public DeliveryProfessional DeliveryProfessional { get; set; } = null!;                
        public List<Mentee> Mentees { get; set; } = new List<Mentee>();
    }
}
