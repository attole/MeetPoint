using Microsoft.AspNetCore.Identity;

namespace MeetPoint.Infrastructure.Persistence.Entities;

#nullable disable
public class UserFriend
{
    public string UserId { get; set; }
    public string OtherUserId { get; set; }

    public ApplicationUser User { get; set; }
    public ApplicationUser OtherUser { get; set; }
}
