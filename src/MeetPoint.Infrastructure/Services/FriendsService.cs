using MeetPoint.Application.Interfaces;
using MeetPoint.Domain.Entities;
using MeetPoint.Infrastructure.Persistence;
using MeetPoint.Infrastructure.Persistence.Entities;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MeetPoint.Infrastructure.Services;

public class FriendService(AppDbContext dbContext) : IFriendsService<string, ApplicationUser>
{
    private readonly AppDbContext _db = dbContext;

    public async Task<List<ApplicationUser>> GetFriendsAsync(string userId)
    {
        return await _db.UserFriends
            .Where(uf => uf.UserId == userId || uf.OtherUserId == userId)
            .Select(uf => uf.UserId == userId ? uf.OtherUser : uf.User)
            .Distinct()
            .ToListAsync();
    }

    public async Task<Result> Befriend(string userId, string otherUserId)
    {
        if (await IsFriends(userId, otherUserId))
            return Result.Failure(new Exception("Users are already friends"));

        await _db.UserFriends.AddAsync(new UserFriend { UserId = userId, OtherUserId = otherUserId });
        await _db.SaveChangesAsync();

        return Result.Success;
    }

    public async Task<Result> DeleteFriend(string userId, string otherUserId)
    {
        if (!await IsFriends(userId, otherUserId))
            return Result.Failure(new Exception("Users not friends"));

        if (_db.UserFriends.FirstOrDefaultAsync(uf => uf.UserId == userId && uf.OtherUserId == otherUserId) == null)
            (userId, otherUserId) = (otherUserId, userId);

        _db.UserFriends.Remove(new UserFriend { UserId = userId, OtherUserId = otherUserId });
        await _db.SaveChangesAsync();

        return Result.Success;
    }

    private async Task<bool> IsFriends(string userId, string otherUserId) =>
        (await GetFriendsAsync(userId)).FirstOrDefault(u => u.Id == otherUserId) != null;
}
