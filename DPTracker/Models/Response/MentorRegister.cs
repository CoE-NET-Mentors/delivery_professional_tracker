namespace DPTracker.Models.Response
{
    public class MentorRegister
    {
        public string DisplayName { get; init; }
        public MentorRegister(Data.Mentor mentor)
        {
            DisplayName = mentor.DeliveryProfessional.DisplayName;
        }
    }
}
