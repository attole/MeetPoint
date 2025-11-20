using MeetPoint.Domain.Entities;

namespace MeetPoint.Application.Interfaces;

public interface IFriendsService<TId, TUser>
{
    public Task<List<TUser>> GetFriendsAsync(TId userId);
    public Task<Result> Befriend(TId userId, TId otherUserId);
    public Task<Result> DeleteFriend(TId userId, TId otherUserId);
}
