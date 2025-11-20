using MeetPoint.Infrastructure.Cache;
using MeetPoint.Infrastructure.SignalR;
using Microsoft.AspNetCore.SignalR;

public class UsersGeoDataEmitService(IGeoDataRedisService geoDataService, IHubContext<SessionHub> hubContext, ISessionHubUsersService sessionHubUsersService) : IDisposable
{
    private readonly IGeoDataRedisService _geoDataService = geoDataService;
    private readonly IHubContext<SessionHub> _hubContext = hubContext;
    private readonly ISessionHubUsersService _sessionHubUsersService = sessionHubUsersService;

    private Timer? _timer;
    private bool _isRunning = false;
    public void StartEmitting(string sessionId)
    {
        if (_timer == null)
        {
            _timer = new Timer(async _ => await EmitGeoDataAsync(sessionId), null, 0, 1000);
        }
        else
        {
            _timer.Change(0, 1000);
        }
    }

    public void StopEmitting()
    {
        _timer?.Change(Timeout.Infinite, Timeout.Infinite);
    }


    public async Task EmitGeoDataAsync(string sessionId)
    {
        if (_isRunning)
            return;

        _isRunning = true;
        try
        {
            var users = await _sessionHubUsersService.AllSessionMembers(sessionId);
            var AllGeoData = new List<(string, List<string>)>();

            foreach (var user in users)
            {
                var geoDataList = await _geoDataService.GetUserGeoDataListByType(user, "standart", "full");
                AllGeoData.Add((user, geoDataList));
            }

            await _hubContext.Clients.Group(sessionId).SendAsync("ReceiveGeoDataList", AllGeoData);
        }
        catch
        {
        }
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}
