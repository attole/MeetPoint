using MeetPoint.Domain.ValueObjects;
using MeetPoint.Domain.Enums;

namespace MeetPoint.Domain.Entities;

public class SessionOwner : SessionParticipant
{
	internal SessionOwner(Guid userId, (MapSettings, PlacesSettings, RoutesSettings) settings)
	: base(userId, UserType.Owner, settings) { }
}