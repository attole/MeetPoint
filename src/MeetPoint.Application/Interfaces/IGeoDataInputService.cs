using System;
using System.Reactive.Subjects;
using System.Reactive.Linq;
using System.Threading.Tasks;
using MeetPoint.Domain.ValueObjects;

public interface IGeoDataRedisService
{
    Task<bool> IsInAnySessionByType(string userId, string sessionType);
    Task PushUserGeoDataByType(string userId, TimedCoordinates coordinates, string sessionType, string dataType);
    Task<List<string>> GetUserGeoDataListByType(string userId, string sessionType, string dataType);

    Task<string> GetUserGeoDataLatestByType(string userId, string sessionType);
}
