using MeetPoint.Infrastructure.Persistence;

public interface IImageSaveService
{
    public Task SetProfileImageUrl(string userId, string imageUrl);
};

public class ImageSaveService(AppDbContext dbContext) : IImageSaveService
{
    private readonly AppDbContext _db = dbContext;

    public async Task SetProfileImageUrl(string userId, string imageUrl)
    {
        var user = await _db.Users.FindAsync(userId);
        user!.ProfileImageUrl = imageUrl;

        await _db.SaveChangesAsync();
    }
}
