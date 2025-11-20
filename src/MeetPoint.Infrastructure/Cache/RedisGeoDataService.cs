using System.Text.Json;

using MeetPoint.Domain.ValueObjects;


namespace MeetPoint.Infrastructure.Cache;

public class RedisGeoDataService(IRedisService redisService) : IGeoDataRedisService
{
    private readonly IRedisService _redisService = redisService;

    public async Task<bool> IsInAnySessionByType(string userId, string sessionType)
    {
        var sessions = await _redisService.SetMembersAsync(RedisUsersKeys.SessionsByTypeKey(userId, sessionType));

        return sessions.Count != 0;
    }

    public async Task PushUserGeoDataByType(string userId, TimedCoordinates coordinates, string sessionType, string dataType)
    {
        var key = dataType == "full" ? RedisUsersKeys.MovementFullKey(sessionType, userId) : RedisUsersKeys.MovementReducedKey(sessionType, userId);

        var json = JsonSerializer.Serialize(new
        {
            lat = coordinates.Coordinates.Latitude,
            lng = coordinates.Coordinates.Longitude,
            timestamp = coordinates.Timestamp
        });

        await _redisService.SetAddAsync(key, json);
    }


    public async Task<List<string>> GetUserGeoDataListByType(string userId, string sessionType, string dataType)
    {
        var key = dataType == "full" ? RedisUsersKeys.MovementFullKey(sessionType, userId) : RedisUsersKeys.MovementReducedKey(sessionType, userId);

        var values = await _redisService.SetMembersAsync(key);

        var jsonList = values.Select(v => v.ToString()).ToList();
        return jsonList;
    }

    public async Task<string> GetUserGeoDataLatestByType(string userId, string sessionType)
    {
        var key = RedisUsersKeys.MovementFullKey(sessionType, userId);

        var values = await _redisService.SetMembersAsync(key);
        var json = values.Select(v => v.ToString()).Last();
        return json;
    }
}
