namespace DPTracker.Models.Data
{
    public class DeliveryProfessionalRecord
    {
        public Guid Id { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid DeliveryProfessionalId { get; set; }
        public DateTime DateAssigned { get; set; }
        public DateTime? DateCompleted { get; set; }
        public RecordType RecordType { get; set; }

        public DeliveryProfessional DeliveryProfessional { get; set; } = null!;
        public List<RecordNote> RecordNotes { get; set; } = new List<RecordNote>();
        public DeliveryProfessionalRecord()
        {
            Id = Guid.NewGuid();
        }
    }
}
