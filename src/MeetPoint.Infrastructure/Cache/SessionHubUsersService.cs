namespace MeetPoint.Infrastructure.Cache;

public class SessionHubUsersService(IRedisService redisService) : ISessionHubUsersService
{
    private readonly IRedisService _redisService = redisService;

    public async Task<bool> IsOwner(string userId, string sessionId)
    {
        var ownerId = await _redisService.GetStringAsync(RedisSessionKeys.OwnerKey(sessionId));

        return ownerId!.Equals(userId);
    }

    public async Task<string[]> AllSessionMembers(string sessionId)
    {
        var users = await _redisService.SetMembersAsync(RedisSessionKeys.UsersKey(sessionId));

        return [.. users];
    }
}
