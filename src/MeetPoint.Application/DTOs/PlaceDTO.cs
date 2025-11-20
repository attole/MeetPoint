using MeetPoint.Domain.Enums;
using MeetPoint.Domain.ValueObjects;

namespace MeetPoint.Application.DTOs;

public record PlaceDTO(string Name, PlaceType PlaceType, string Address, WeeklySchedule WeeklySchedule, string? Link);