using System.ComponentModel.DataAnnotations;

namespace DPTracker.Models.Request;

public class CreateNewRecordNote
{
    public Guid DeliveryProfessionalRecordId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid CreatedBy { get; set; }

    [StringLength(1024)]
    public string Note { get; set; } = null!;
}