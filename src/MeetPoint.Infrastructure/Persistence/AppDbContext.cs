using System.Threading.Tasks;

using MeetPoint.Infrastructure.Persistence.Entities;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MeetPoint.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<UserFriend> UserFriends { get; set; }
    public DbSet<FriendInvitation> FriendInvitations { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserFriend>(entity =>
        {
            entity.HasKey(uf => new { uf.UserId, uf.OtherUserId });

            entity.HasOne(uf => uf.User).WithMany().HasForeignKey(uf => uf.UserId);
            entity.HasOne(uf => uf.OtherUser).WithMany().HasForeignKey(uf => uf.OtherUserId);
        });

        builder.Entity<FriendInvitation>(entity =>
        {
            entity.HasKey(uf => new { uf.FromUserId, uf.ToUserId });

            entity.HasOne(uf => uf.FromUser).WithMany().HasForeignKey(uf => uf.FromUserId);
            entity.HasOne(uf => uf.ToUser).WithMany().HasForeignKey(uf => uf.ToUserId);
        });

    }
}
