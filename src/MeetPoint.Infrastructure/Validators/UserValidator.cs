using MeetPoint.Infrastructure.Persistence.Entities;

using Microsoft.AspNetCore.Identity;

namespace MeetPoint.Infrastructure.Validators;

public class UserValidator : UserValidator<ApplicationUser>
{
    public override async Task<IdentityResult> ValidateAsync(UserManager<ApplicationUser> manager, ApplicationUser user)
    {
        var baseResult = await base.ValidateAsync(manager, user);
        var errors = baseResult.Succeeded ? [] : baseResult.Errors.ToList();

        if (!ValidateUsername(user.UserName!, out var error))
            errors.Add(error);

        if (errors.Count > 0)
            return IdentityResult.Failed(errors.ToArray());

        return IdentityResult.Success;
    }

    private static bool ValidateUsername(string username, out IdentityError error)
    {
        if (username != null && (username.Length < 3 || username.Length > 15))
        {
            error = new IdentityError { Code = "UsernameLength", Description = "Username length must be between 3 and 15 characters." };
            return false;
        }

        error = null!;
        return true;
    }
}
