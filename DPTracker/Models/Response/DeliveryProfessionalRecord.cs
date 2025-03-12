using DPTracker.Models.Data;

namespace DPTracker.Models.Response
{
    public class DeliveryProfessionalRecord
    {
        public Guid Id { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid DeliveryProfessionalId { get; set; }
        public DateTime DateAssigned { get; set; }
        public DateTime? DateCompleted { get; set; }
        public RecordType RecordType { get; set; }
        public List<RecordNote> RecordNotes { get; set; } = [];
    }
}
