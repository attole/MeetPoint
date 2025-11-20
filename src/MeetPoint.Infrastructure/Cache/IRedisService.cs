namespace MeetPoint.Infrastructure.Cache;

public interface IRedisService
{
    Task SetStringAsync(string key, string value, TimeSpan? expiry = null);
    Task<string?> GetStringAsync(string key);

    Task SetJsonAsync<T>(string key, T value, TimeSpan? expiry = null);
    Task<T?> GetJsonAsync<T>(string key);

    Task HashSetAsync(string key, string field, string value);
    Task<string?> HashGetAsync(string key, string field);
    Task<bool> HashDeleteAsync(string key, string field);
    Task<bool> HashExistsAsync(string key, string field);

    Task<bool> SetAddAsync(string key, string value);
    Task<long> SetAddAsync(string key, IEnumerable<string> values);
    Task<bool> SetRemoveAsync(string key, string value);
    Task<bool> SetContainsAsync(string key, string value);
    Task<IReadOnlyCollection<string>> SetMembersAsync(string key);

    Task<bool> KeyDeleteAsync(string key);
    Task<long> KeyDeleteAsync(IEnumerable<string> keys);
    Task<bool> KeyExistsAsync(string key);
    Task<bool> KeyExpireAsync(string key, TimeSpan expiry);

    Task TrackKeyAsync(string trackingSetKey, string keyToTrack);
    Task TrackKeysAsync(string trackingSetKey, IEnumerable<string> keyToTrack);
    Task<IReadOnlyCollection<string>> GetTrackedKeysAsync(string trackingSetKey);
    Task DeleteTrackedKeysAsync(string trackingSetKey);
}
