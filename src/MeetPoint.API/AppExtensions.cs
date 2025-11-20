using MeetPoint.Infrastructure.Persistence;

namespace MeetPoint.API;

public static class AppExtensions
{
    public static void AddSwaggerUI(this WebApplication app)
    {
        app.UseSwagger(options => options.RouteTemplate = "api/swagger/{documentName}/swagger.json");
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/api/swagger/v1/swagger.json", "MeetPoint API V1");
            c.RoutePrefix = "api/swagger";
        });
    }

    public static void DbContextEnsureCreation(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureCreated();
    }
}
