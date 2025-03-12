namespace DPTracker.Models.Request;

public class CreateNewRecord
{
    public Guid CreatedBy { get; set; }
    public Guid DeliveryProfessionalId { get; set; }
    public DateTime DateAssigned { get; set; }
    public DateTime? DateCompleted { get; set; }
    public int RecordTypeId { get; set; }
    public List<CreateNewRecordNote> RecordNotes { get; set; } = [];
}