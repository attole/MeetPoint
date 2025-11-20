using Microsoft.AspNetCore.Identity;

namespace MeetPoint.Infrastructure.Persistence.Entities;

#nullable disable
public class FriendInvitation
{
    public string FromUserId { get; set; }
    public string ToUserId { get; set; }
    public bool Accepted { get; set; }

    public ApplicationUser FromUser { get; set; }
    public ApplicationUser ToUser { get; set; }
}
