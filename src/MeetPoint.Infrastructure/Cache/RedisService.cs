using StackExchange.Redis;

using System.Text.Json;

namespace MeetPoint.Infrastructure.Cache;

public class RedisService : IRedisService
{
    private readonly IDatabase _db;
    private readonly IConnectionMultiplexer _redis;
    private readonly JsonSerializerOptions _jsonOptions;

    public RedisService(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _db = redis.GetDatabase();
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };
    }

    public Task SetStringAsync(string key, string value, TimeSpan? expiry = null)
        => _db.StringSetAsync(key, value, expiry);

    public async Task<string?> GetStringAsync(string key)
    {
        var val = await _db.StringGetAsync(key);
        return val.HasValue ? val.ToString() : null;
    }


    public Task SetJsonAsync<T>(string key, T value, TimeSpan? expiry = null)
    {
        var json = JsonSerializer.Serialize(value, _jsonOptions);
        return _db.StringSetAsync(key, json, expiry);
    }

    public async Task<T?> GetJsonAsync<T>(string key)
    {
        var val = await _db.StringGetAsync(key);
        if (!val.HasValue)
            return default;
        return JsonSerializer.Deserialize<T>(val!, _jsonOptions);
    }


    public Task HashSetAsync(string key, string field, string value)
        => _db.HashSetAsync(key, field, value);

    public async Task<string?> HashGetAsync(string key, string field)
    {
        var val = await _db.HashGetAsync(key, field);
        return val.HasValue ? val.ToString() : null;
    }

    public Task<bool> HashDeleteAsync(string key, string field)
        => _db.HashDeleteAsync(key, field);

    public Task<bool> HashExistsAsync(string key, string field)
        => _db.HashExistsAsync(key, field);


    public async Task<bool> SetAddAsync(string key, string value)
        => await _db.SetAddAsync(key, value);
    public async Task<long> SetAddAsync(string key, IEnumerable<string> values)
    {
        var redisValues = values.Select(k => (RedisValue) k).ToArray();
        return await _db.SetAddAsync(key, redisValues);
    }

    public async Task<bool> SetRemoveAsync(string key, string value)
        => await _db.SetRemoveAsync(key, value);

    public async Task<bool> SetContainsAsync(string key, string value)
        => await _db.SetContainsAsync(key, value);

    public async Task<IReadOnlyCollection<string>> SetMembersAsync(string key)
    {
        var members = await _db.SetMembersAsync(key);
        return members.Select(m => m.ToString()!).ToArray();
    }

    public Task<bool> KeyDeleteAsync(string key)
        => _db.KeyDeleteAsync(key);

    public Task<long> KeyDeleteAsync(IEnumerable<string> keys)
    {
        var redisKeys = keys.Select(k => (RedisKey) k).ToArray();
        return _db.KeyDeleteAsync(redisKeys);
    }

    public Task<bool> KeyExistsAsync(string key)
        => _db.KeyExistsAsync(key);

    public Task<bool> KeyExpireAsync(string key, TimeSpan expiry)
        => _db.KeyExpireAsync(key, expiry);

    // Cascade key tracking
    // trackingSetKey: e.g. "user:{userId}:keys"
    // keyToTrack: full key name to track for cascade delete
    public async Task TrackKeyAsync(string trackingSetKey, string keyToTrack)
    {
        await _db.SetAddAsync(trackingSetKey, keyToTrack);
    }

    public async Task TrackKeysAsync(string trackingSetKey, IEnumerable<string> keyToTrack) =>
        await SetAddAsync(trackingSetKey, keyToTrack);

    public async Task<IReadOnlyCollection<string>> GetTrackedKeysAsync(string trackingSetKey)
    {
        var keys = await _db.SetMembersAsync(trackingSetKey);
        return [.. keys.Select(k => k.ToString()!)];
    }

    public async Task DeleteTrackedKeysAsync(string trackingSetKey)
    {
        var keys = await GetTrackedKeysAsync(trackingSetKey);
        if (keys.Count > 0)
        {
            await KeyDeleteAsync(keys);
        }
        await KeyDeleteAsync(trackingSetKey);
    }
}
