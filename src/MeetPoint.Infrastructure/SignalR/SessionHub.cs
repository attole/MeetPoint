using System.Security.Claims;

using MeetPoint.Application.Interfaces;
using MeetPoint.Domain.Entities;
using MeetPoint.Domain.Enums;
using MeetPoint.Infrastructure.Cache;

using Microsoft.AspNetCore.SignalR;

namespace MeetPoint.Infrastructure.SignalR;

public class SessionHub(ISessionHubService sessionHubService, ISessionHubUsersService sessionHubUsersService) : Hub
{
    private ISessionHubService _sessionHubService = sessionHubService;
    private ISessionHubUsersService _sessionHubUsersService = sessionHubUsersService;

    public Task<string> GenerateToken() =>
        _sessionHubService.GenerateSessionId();

    public Task<bool> CheckToken(string token) =>
        _sessionHubService.IsSessionExist(token);

    public async Task CreateSession(string sessionId, string sessionType, SessionSettings settingsJson)
    {
        if (await _sessionHubService.IsSessionExist(sessionId))
            throw new Exception("Session already exist");

        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
        await _sessionHubService.CreateSession(Context.UserIdentifier!, sessionId, sessionType, settingsJson);
    }

    public async Task DeleteSession(string sessionId)
    {
        if (!await _sessionHubService.IsSessionExist(sessionId))
            throw new Exception("Session do not exist exist");

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);
        await _sessionHubService.DeleteSession(sessionId);
    }

    public async Task JoinSession(string sessionId)
    {
        if (!await _sessionHubService.IsSessionExist(sessionId))
            throw new Exception("Session do not exist exist");

        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
        await _sessionHubService.JoinSession(Context.UserIdentifier!, sessionId);
    }

    public async Task LeaveSesion(string sessionId)
    {
        if (!await _sessionHubService.IsSessionExist(sessionId))
            throw new Exception("Session do not exist");

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);
        await _sessionHubService.LeaveSession(Context.UserIdentifier!, sessionId);
    }

    public async Task<bool> IsOwner(string sessionId)
    {
        if (!await _sessionHubService.IsSessionExist(sessionId))
            throw new Exception("Session do not exist exist");

        return await _sessionHubUsersService.IsOwner(Context.UserIdentifier!, sessionId);
    }
}
