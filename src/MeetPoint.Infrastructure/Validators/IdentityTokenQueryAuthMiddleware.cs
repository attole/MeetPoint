using System.Security.Claims;
using MeetPoint.Infrastructure.Persistence.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace MeetPoint.Infrastructure.Validators;

public class IdentityTokenQueryAuthenticationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IServiceProvider _serviceProvider;

    public IdentityTokenQueryAuthenticationMiddleware(RequestDelegate next, IServiceProvider serviceProvider)
    {
        _next = next;
        _serviceProvider = serviceProvider;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var userManager = context.RequestServices.GetRequiredService<UserManager<ApplicationUser
        >>();
        if (!context.Request.Path.StartsWithSegments("/hubs"))
        {
            await _next(context);
            return;
        }


        var userId = context.Request.Query["userId"].ToString();
        var user = await userManager.FindByIdAsync(userId);

        if (user != null)
        {
            var identity = new ClaimsIdentity("IdentityToken");
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
            identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName ?? ""));

            var claimsPrincipal = new ClaimsPrincipal(identity);

            context.User = claimsPrincipal;
        }

        await _next(context);
    }
}
