namespace DPTracker.Models.Response
{
    public class FetchAll
    {
        public FetchMentees Mentees { get; set; } = new FetchMentees();
        public FetchDeliveryProfessionals DeliveryProfessionals { get; set; } = new FetchDeliveryProfessionals();
    }
}