namespace DPTracker.Models.Response
{
    public class FetchMentees : List<Mentee>
    {
        public FetchMentees()
        {

        }
        public FetchMentees(List<Models.Data.Mentee> menteeList)
        {
            foreach (var m in menteeList)
            {
                this.Add(new Mentee(m.Id, m.DeliveryProfessional.DisplayName));
            }
        }
    }
}