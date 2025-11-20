namespace MeetPoint.Infrastructure.Cache;

public interface ISessionHubUsersService
{
    Task<bool> IsOwner(string userId, string sessionId);
    Task<string[]> AllSessionMembers(string sessionId);
}
