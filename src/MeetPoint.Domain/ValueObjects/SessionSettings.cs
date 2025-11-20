using MeetPoint.Domain.Enums;

namespace MeetPoint.Domain.ValueObjects;

public readonly record struct SessionSettings(PlaceType[] placeFilters);
