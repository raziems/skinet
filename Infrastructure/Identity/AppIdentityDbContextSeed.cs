using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user=new AppUser{
                    DisplayName="Bob",
                    Email="bob@test.com",
                    UserName="bob@test.com",
                    Address=new Address
                    {
                        FirstName="Bob",
                        LastName="Bobby",
                        Street="101 The Street",
                        City ="Bukit Mertajam",
                        State="MY",
                        ZipCode="14000"

                    }

                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
                


            }
        }
    }
}