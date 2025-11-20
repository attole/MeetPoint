using MeetPoint.Application.Interfaces;
using MeetPoint.Domain.Entities;
using MeetPoint.Infrastructure.Persistence;
using MeetPoint.Infrastructure.Persistence.Entities;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MeetPoint.Infrastructure.Services;

public class FriendInvitationService(AppDbContext dbContext, IFriendsService<string, ApplicationUser> friendsService)
    : IFriendInvitationsService<string>
{
    private readonly AppDbContext _db = dbContext;
    private readonly IFriendsService<string, ApplicationUser> _friendsService = friendsService;

    public async Task<Result> Send(string fromUserId, string toUserId)
    {
        var invitationResult = await InvitationExist(fromUserId, toUserId);
        if (invitationResult.Succeded)
            return Result.Failure(new Exception("There is already a pending friend invitation between users"));

        var invitation = new FriendInvitation { FromUserId = fromUserId, ToUserId = toUserId };
        await _db.FriendInvitations.AddAsync(invitation);
        await _db.SaveChangesAsync();
        return Result.Success;
    }

    public async Task<Result> Accept(string fromUserId, string toUserId)
    {
        var invitationResult = await InvitationExist(fromUserId, toUserId);
        if (!invitationResult.Succeded)
            return Result.Failure(new Exception("There is no pending friend invitation between users"));

        invitationResult.Value.Accepted = true;
        _db.FriendInvitations.Update(invitationResult.Value);

        var befriendResult = await _friendsService.Befriend(fromUserId, toUserId);
        if (!befriendResult.Succeded)
            return befriendResult;

        await _db.SaveChangesAsync();
        return Result.Success;
    }

    public async Task<Result> Reject(string fromUserId, string toUserId)
    {
        var invitationResult = await InvitationExist(fromUserId, toUserId);
        if (!invitationResult.Succeded)
            return Result.Failure(new Exception("There is no pending friend invitation between users"));

        invitationResult.Value.Accepted = false;
        _db.FriendInvitations.Update(invitationResult.Value);
        await _db.SaveChangesAsync();
        return Result.Success;
    }

    public async Task<List<string>> GetPendingInvitations(string toUserId)
    {
        return await _db.FriendInvitations.Where(fi => fi.ToUserId == toUserId && fi.Accepted == false).Select(i => i.FromUserId).ToListAsync();
    }

    public async Task<List<string>> GetActiveSentInvitations(string fromUserId)
    {
        return await _db.FriendInvitations.Where(fi => fi.FromUserId == fromUserId && fi.Accepted == false).Select(i => i.ToUserId).ToListAsync();
    }

    private async Task<Result<FriendInvitation>> InvitationExist(string fromUserId, string toUserId)
    {
        var result = await _db.FriendInvitations.FirstOrDefaultAsync(u =>
            u.FromUserId == fromUserId && u.ToUserId == toUserId);

        return Result<FriendInvitation>.FromValue(result);
    }
}
