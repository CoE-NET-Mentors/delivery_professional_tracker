using Microsoft.Graph.Models;

namespace DPTracker.Models.Response
{
    public class FetchDeliveryProfessionals : List<DeliveryProfessional>
    {
        public FetchDeliveryProfessionals()
        {

        }
        public FetchDeliveryProfessionals(List<Models.Data.DeliveryProfessional> dps)
        {
            foreach (var dp in dps)
            {
                this.Add(new DeliveryProfessional(dp.Id, dp.DisplayName, dp.Email));
            }
        }

        public FetchDeliveryProfessionals(List<User>? msGraphUsers)
        {
            foreach (var user in msGraphUsers!)
            {
                this.Add(new DeliveryProfessional(Guid.Parse(user.Id!), user.DisplayName!, user.Mail!));
            }
        }
    }
}