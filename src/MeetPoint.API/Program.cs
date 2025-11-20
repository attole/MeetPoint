using MeetPoint.API;
using MeetPoint.Application.Interfaces;
using MeetPoint.Infrastructure.Cache;
using MeetPoint.Infrastructure.Persistence;
using MeetPoint.Infrastructure.Persistence.Entities;
using MeetPoint.Infrastructure.Services;
using MeetPoint.Infrastructure.SignalR;
using MeetPoint.Infrastructure.Validators;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

builder.Services
    .AddBasicIdentity()
    .AddIdentityValidation()
    .AddAuth();

builder.Services
    .AddScoped<IFriendsService<string, ApplicationUser>, FriendService>()
    .AddScoped<IFriendInvitationsService<string>, FriendInvitationService>()
    .AddScoped<IImageSaveService, ImageSaveService>();

var redisConnection = builder.Configuration.GetConnectionString("Redis");
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
  ConnectionMultiplexer.Connect(redisConnection!));

builder.Services.AddSingleton<IRedisService, RedisService>();
builder.Services.AddSingleton<ISessionHubService, SessionHubService>();
builder.Services.AddSingleton<ISessionHubUsersService, SessionHubUsersService>();
builder.Services.AddSingleton<IImageService, ImageService>();
//builder.Services.AddSingleton<IGeoDataRedisService, RedisGeoDataService>();
//builder.Services.AddScoped<GeoDataIntoRedisService>();
//builder.Services.AddScoped<UsersGeoDataEmitService>();

builder.Services.AddSignalR(options => options.EnableDetailedErrors = true).AddStackExchangeRedis(redisConnection!, options =>
  { options.Configuration.ChannelPrefix = RedisChannel.Literal("SignalR"); });

builder.Services.AddLocalSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.AddSwaggerUI();
    app.DbContextEnsureCreation();
}

app.UseCors(x => x.AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true)
    .AllowCredentials());

app.UseHttpsRedirection();
app.UseRouting();

app.MapGroup("/api/account/").MapIdentityApi<ApplicationUser>();

app.UseMiddleware<IdentityTokenQueryAuthenticationMiddleware>();
app.MapHub<SessionHub>("/hubs/session");

app.MapControllers();

app.UseAuthentication();
app.UseAuthorization();

//image
app.UseStaticFiles();

app.Run();
