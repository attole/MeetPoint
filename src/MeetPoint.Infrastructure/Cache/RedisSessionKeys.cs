namespace MeetPoint.Infrastructure.Cache;

public static class RedisSessionKeys
{
    public static string MetaKey(string sessionId) =>
        $"session:{sessionId}:meta";

    public static string OwnerKey(string sessionId) =>
        $"session:{sessionId}:owner";

    public static string UsersKey(string sessionId) =>
        $"session:{sessionId}:users";

    public static string SettingsKey(string sessionId) =>
        $"session:{sessionId}:settings";

    public static string GeocenterKey(string sessionId) =>
        $"session:{sessionId}:geocenter";
        
    public static string FinalPlaceKey(string sessionId) =>
        $"session:{sessionId}:finalPlace";

    public static string TTLKey(string sessionId) =>
        $"session:{sessionId}:ttl-anchor";

    public static string[] AllKeysForTTL(string sessionId) => [
        MetaKey(sessionId),
        OwnerKey(sessionId),
        UsersKey(sessionId),
        SettingsKey(sessionId),
        GeocenterKey(sessionId),
        FinalPlaceKey(sessionId)
    ];
}
