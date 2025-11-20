namespace MeetPoint.API.DTOs;

public record UserDto(string Id, string Email, string Username, string PhoneNumber, string ProfileImageUrl);

public record UpdateDTO(string Username, string PhoneNumber);
