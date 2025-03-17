using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DPTracker.Models.Request;

public class CreateNewRecordNote
{
    [JsonPropertyName("deliveryProfessionalRecordId")]
    public Guid? DeliveryProfessionalRecordId { get; set; }
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [JsonPropertyName("createdBy")]
    public Guid CreatedBy { get; set; }
    [JsonPropertyName("note")]
    [StringLength(1024)]
    public string Note { get; set; } = null!;
}