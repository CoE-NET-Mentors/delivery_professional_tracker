using System.ComponentModel.DataAnnotations;

namespace DPTracker.Models.Data
{
    public class DeliveryProfessional
    {
        public Guid Id { get; set; }

        [StringLength(254)]
        public string DisplayName { get; set; } = null!;

        [EmailAddress, StringLength(254)]
        public string Email { get; set; } = null!;
    }
}
