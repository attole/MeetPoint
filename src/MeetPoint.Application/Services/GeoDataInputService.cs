namespace MeetPoint.Application.Services;

public class GeoDataIntoRedisService : IDisposable
{
    private readonly IGeoDataRedisService _geoDataService;
    private readonly Subject<(string userId, string sessionType, TimedCoordinates coordinates)> _subject = new();

    private readonly IDisposable _debounce5SecSubscription;
    private readonly IDisposable _debounce1SecSubscription;

    public GeoDataIntoRedisService(IGeoDataRedisService geodataService)
    {
        _geoDataService = geodataService;

        // 5 second debounce stream
        _debounce5SecSubscription = _subject
            .Throttle(TimeSpan.FromSeconds(5))
            .Subscribe(async data => await WriteToRedis(data.userId, data.sessionType, data.coordinates, "reduced"));

        // 1 second debounce stream
        _debounce1SecSubscription = _subject
            .Throttle(TimeSpan.FromSeconds(1))
            .Subscribe(async data => await WriteToRedis(data.userId, data.sessionType, data.coordinates, "full"));
    }

    public void OnNext(string userId, string sessionType, TimedCoordinates timedCoordinates)
    {
        _subject.OnNext((userId, sessionType, timedCoordinates));
    }

    private async Task WriteToRedis(string userId, string sessionType, TimedCoordinates data, string dataType)
    {

        await _geoDataService.PushUserGeoDataByType(userId, data, sessionType, dataType);
    }

    public void Dispose()
    {
        _debounce5SecSubscription.Dispose();
        _debounce1SecSubscription.Dispose();
        _subject.Dispose();
    }
}
