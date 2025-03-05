using DPTracker.Extensions;
using Microsoft.Graph;

namespace DPTracker.Services
{
    public class DPListCache
    {
        private readonly DateTime _lastFetch;
        private readonly List<Models.Data.DeliveryProfessional> _deliveryProfessionals;
        public DPListCache()
        {
            _deliveryProfessionals = new List<Models.Data.DeliveryProfessional>();
            _lastFetch = DateTime.MinValue;
        }

        public async Task<List<Models.Data.DeliveryProfessional>> GetAll(GraphService graphService)
        {
            if (_lastFetch <= DateTime.UtcNow)
            {
                _deliveryProfessionals.Clear();
                _deliveryProfessionals.AddRange(await graphService.GetAllASync());
            }
            return _deliveryProfessionals;
        }
    }

    public class GraphService
    {
        private readonly GraphServiceClient _graphServiceClient;

        public GraphService(GraphServiceClient graphServiceClient)
        {
            _graphServiceClient = graphServiceClient;
        }

        public async Task<Models.Data.DeliveryProfessional> GetMeAsync()
        {
            var me = await _graphServiceClient.Me.GetAsync();
            return new Models.Data.DeliveryProfessional
            {
                Id = Guid.Parse(me?.Id!),
                DisplayName = me?.DisplayName!,
                Email = me?.Mail!
            };
        }

        public async Task<List<Models.Data.DeliveryProfessional>> GetAllASync()
        {
            var response = new List<Models.Data.DeliveryProfessional>();
            var all = await _graphServiceClient.GetAllUsersAsync();
            foreach (var user in all)
            {
                response.Add(new Models.Data.DeliveryProfessional
                {
                    Id = Guid.Parse(user?.Id!),
                    DisplayName = user?.DisplayName!,
                    Email = user?.Mail!
                });
            }
            return response;
        }

    }
}
