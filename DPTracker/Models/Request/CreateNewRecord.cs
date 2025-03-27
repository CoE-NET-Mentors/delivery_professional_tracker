using System.Text.Json.Serialization;

namespace DPTracker.Models.Request;

public class CreateNewRecord
{
    [JsonPropertyName("createdBy")]
    public Guid CreatedBy { get; set; }
    [JsonPropertyName("dateAssigned")]
    public DateTime DateAssigned { get; set; }
    [JsonPropertyName("dateCompleted")]
    public DateTime? DateCompleted { get; set; }
    [JsonPropertyName("recordTypeId")]
    public int RecordTypeId { get; set; }
    [JsonPropertyName("recordNotes")]
    public List<CreateNewRecordNote> RecordNotes { get; set; } = [];
}