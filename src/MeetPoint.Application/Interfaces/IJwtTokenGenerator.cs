namespace MeetPoint.Application.Interfaces;

public interface IJwtTokenGenerator<TUser>
{
    public string GenerateAccessToken(TUser user);
    public string GenerateRefreshToken();
}
