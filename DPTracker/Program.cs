using DPTracker.Services;
using DPTracker.Services.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Host.UseSerilog((ctx, lc) => lc.ReadFrom.Configuration(ctx.Configuration));
    builder.Services.AddMicrosoftIdentityWebApiAuthentication(builder.Configuration).EnableTokenAcquisitionToCallDownstreamApi().AddMicrosoftGraph(builder.Configuration.GetSection("Graph")).AddInMemoryTokenCaches();    
    builder.Services.AddDbContext<DPTrackerDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DPTrackerDB")));
    builder.Services.AddControllers();
    builder.Services.AddSpaStaticFiles(configure => configure.RootPath = "wwwroot");

    builder.Services.AddSingleton<DPListCache>();
    builder.Services.AddScoped<GraphService>();
}
var app = builder.Build();
{
    app.UseExceptionHandler("/api/Error/500");
    app.UseStatusCodePagesWithReExecute("/api/Error/{0}");

    app.UseDefaultFiles(new DefaultFilesOptions
    {
        DefaultFileNames = new List<string> { "index.html" }
    });

    const string cacheMaxAge = "720";
    app.UseStaticFiles(new StaticFileOptions
    {
        OnPrepareResponse = ctx =>
        {
            ctx.Context.Response.Headers.Append(
                "Cache-Control", $"public, max-age={cacheMaxAge}");
        }
    });
    app.UseSerilogRequestLogging();
    
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.UseSpa(configuration => configuration.Options.DefaultPage = new Microsoft.AspNetCore.Http.PathString("/index.html"));
}
app.Run();
