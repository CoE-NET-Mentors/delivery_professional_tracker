using Microsoft.Graph;
using Microsoft.Graph.Models;

namespace DPTracker.Extensions
{
    public static class GraphServiceClientExtensions
    {
        public async static Task<List<User>> GetAllUsersAsync(this GraphServiceClient client)
        {
            List<User> allUsers = new List<User>();
            var usersPage = await client.Users.GetAsync();

            while (usersPage != null)
            {
                if (usersPage.Value != null)
                {
                    allUsers.AddRange(usersPage.Value.Where(u => !string.IsNullOrEmpty(u.DisplayName) && !string.IsNullOrEmpty(u.Mail)));
                }

                // Follow the ODataNextLink if more pages exist
                if (!string.IsNullOrEmpty(usersPage.OdataNextLink))
                {
                    usersPage = await client.Users.WithUrl(usersPage.OdataNextLink).GetAsync();
                }
                else
                {
                    break;
                }
            }
            return allUsers;
        }
    }
}
