using System.ComponentModel.DataAnnotations;

namespace DPTracker.Models.Data
{
    public class RecordNote
    {
        public Guid DeliveryProfessionalRecordId { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid CreatedBy { get; set; }

        [StringLength(1024)]
        public string Note { get; set; } = null!;

        public DeliveryProfessionalRecord DeliveryProfessionalRecord { get; set; } = null!;

        public RecordNote()
        {
            CreatedAt = DateTime.UtcNow;
        }
    }
}
