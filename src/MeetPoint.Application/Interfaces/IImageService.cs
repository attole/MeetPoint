namespace MeetPoint.Application.Interfaces;

public interface IImageService
{
    Task<string> UploadImageAsync(IFormFile image);
}
