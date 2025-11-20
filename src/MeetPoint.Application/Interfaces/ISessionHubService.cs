using MeetPoint.Domain.Enums;

namespace MeetPoint.Application.Interfaces;

public interface ISessionHubService
{
    Task CreateSession(string userId, string sessionId, string sessionType, SessionSettings settingsJson);
    Task DeleteSession(string sessionId);

    Task JoinSession(string userId, string sessionId);
    Task LeaveSession(string userId, string sessionId);

    Task<string> GenerateSessionId();
    Task<bool> IsSessionExist(string sessionId);
}
