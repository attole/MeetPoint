using Microsoft.AspNetCore.Identity;

namespace MeetPoint.Infrastructure.Persistence.Entities;

public class ApplicationUser : IdentityUser
{
    public string? ProfileImageUrl { get; set; }
}
