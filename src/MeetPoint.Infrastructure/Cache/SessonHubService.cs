using MeetPoint.Application.Interfaces;
using MeetPoint.Domain.Enums;

namespace MeetPoint.Infrastructure.Cache;

public class SessionHubService(IRedisService redisService) : ISessionHubService
{
    private readonly IRedisService _redisService = redisService;

    public async Task CreateSession(string userId, string sessionId, string sessionType, SessionSettings sessionSettings)
    {
        await _redisService.SetAddAsync(RedisUsersKeys.SessionsByTypeKey(userId, sessionType), sessionId);

        var meta = new SessionMeta() { type = sessionType };
        await _redisService.SetJsonAsync(RedisSessionKeys.MetaKey(sessionId), meta);

        await _redisService.SetStringAsync(RedisSessionKeys.OwnerKey(sessionId), userId);
        await _redisService.SetAddAsync(RedisSessionKeys.UsersKey(sessionId), userId);

        await _redisService.SetJsonAsync(RedisSessionKeys.SettingsKey(sessionId), sessionSettings);

        await _redisService.TrackKeysAsync(RedisUsersKeys.TTLKey(sessionId, userId), RedisUsersKeys.AllKeysForTTl(sessionId, userId));
        await _redisService.TrackKeysAsync(RedisSessionKeys.TTLKey(sessionId), RedisSessionKeys.AllKeysForTTL(sessionId));

    }

    public async Task DeleteSession(string sessionId)
    {
        var meta = await _redisService.GetJsonAsync<SessionMeta>(RedisSessionKeys.MetaKey(sessionId));

        var usersId = await _redisService.SetMembersAsync(RedisSessionKeys.UsersKey(sessionId));
        foreach (var userId in usersId)
        {
            await _redisService.SetRemoveAsync(RedisUsersKeys.SessionsByTypeKey(userId, meta!.type), sessionId);
            await _redisService.DeleteTrackedKeysAsync(RedisUsersKeys.TTLKey(sessionId, userId));
        }


        await _redisService.DeleteTrackedKeysAsync(RedisSessionKeys.TTLKey(sessionId));
    }

    public async Task JoinSession(string userId, string sessionId)
    {
        var meta = await _redisService.GetJsonAsync<SessionMeta>(RedisSessionKeys.MetaKey(sessionId));
        await _redisService.SetAddAsync(RedisUsersKeys.SessionsByTypeKey(userId, meta!.type), sessionId);

        await _redisService.SetAddAsync(RedisSessionKeys.UsersKey(sessionId), userId);

        await _redisService.TrackKeysAsync(RedisUsersKeys.TTLKey(sessionId, userId), RedisUsersKeys.AllKeysForTTl(sessionId, userId));
    }

    public async Task LeaveSession(string userId, string sessionId)
    {
        var meta = await _redisService.GetJsonAsync<SessionMeta>(RedisSessionKeys.MetaKey(sessionId));
        await _redisService.SetRemoveAsync(RedisUsersKeys.SessionsByTypeKey(sessionId, meta!.type), userId);

        await _redisService.DeleteTrackedKeysAsync(RedisUsersKeys.TTLKey(sessionId, userId));

        await _redisService.TrackKeysAsync(RedisUsersKeys.TTLKey(sessionId, userId), RedisUsersKeys.AllKeysForTTl(sessionId, userId));
    }

    public async Task<bool> IsSessionExist(string sessionId) =>
        await _redisService.KeyExistsAsync(RedisSessionKeys.MetaKey(sessionId));

    public Task<string> GenerateSessionId() => Task.FromResult(Guid.NewGuid().ToString()[..10]);
}
