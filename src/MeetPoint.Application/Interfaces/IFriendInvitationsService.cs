using MeetPoint.Domain.Entities;

namespace MeetPoint.Application.Interfaces;

public interface IFriendInvitationsService<TId>
{
    public Task<Result> Send(TId fromUserId, TId toUserId);
    public Task<Result> Accept(TId fromUserId, TId toUserId);
    public Task<Result> Reject(TId fromUserId, TId toUserId);
    public Task<List<TId>> GetPendingInvitations(TId toUserId);
    public Task<List<TId>> GetActiveSentInvitations(TId fromUserId);
}
