using MeetPoint.Infrastructure.Persistence.Entities;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ImageController(IImageService imageService, IImageSaveService imageSaveService, UserManager<ApplicationUser> userManager) : ControllerBase
{
    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] IFormFile image)
    {
        try
        {
            var relativePath = await imageService.UploadImageAsync(image);
            var user = await userManager.GetUserAsync(User);
            await imageSaveService.SetProfileImageUrl(user!.Id, relativePath);

            return Ok(new { url = relativePath });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
