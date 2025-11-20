namespace MeetPoint.Infrastructure.Cache;

public static class RedisUsersKeys
{
    public static string SessionsByTypeKey(string userId, string sessionType) =>
       $"user:{userId}:sessions:{sessionType}";

    public static string SettingsKey(string sessionId, string userId) =>
        $"session:{sessionId}:user:{userId}:settings";

    public static string MovementFullKey(string dataType, string userId) =>
        $"user:{userId}:movement:{dataType}:full";

    public static string MovementReducedKey(string dataType, string userId) =>
        $"user:{userId}:movement:{dataType}:reduced";

    public static string RouteKey(string sessionId, string userId) =>
        $"session:{sessionId}:user:{userId}:route";

    public static string TTLKey(string sessionId, string userId) =>
        $"session:{sessionId}:user:{userId}:ttl-anchor";

    public static IEnumerable<string> AllKeysForTTl(string sessionId, string userId) => [
        RouteKey(sessionId, userId),
        SettingsKey(sessionId, userId)
    ];
}
