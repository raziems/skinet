using API.Extensions;
using API.Helpers;
using API.Middleware;
using Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            _config = config;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MappingProfiles));
            services.AddControllers();
            services.AddDbContext<StoreContext>(x =>
                x.UseSqlite(_config.GetConnectionString("DefaultConnection")));

            //Redis config
            services.AddSingleton<IConnectionMultiplexer>(c => {
                var configuration = ConfigurationOptions.Parse(_config.
                GetConnectionString("Redis"),
                true);//set to true to ignore any unknown config

                return ConnectionMultiplexer.Connect(configuration);

            });

            services.AddApplicationServices();
            services.AddSwaggerDocumentation();
            services.AddCors(opt=>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            }); //if client running on an unsecure port, not going to return any header information


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            //ordering is important for Configure
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseStatusCodePagesWithReExecute("/error/{0}");//redirect to error controller if no endpoint

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseStaticFiles();//To serve static API request

            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.UseSwaggerDocumentation();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}