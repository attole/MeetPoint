using MeetPoint.Domain.Enums;
using MeetPoint.Domain.ValueObjects;

namespace MeetPoint.Domain.Entities;

public class SessionParticipantFactory
{
	private MapSettings _mapSettings { get; set; } = MapSettings.Default;
	private PlacesSettings _placesSettings { get; set; } = PlacesSettings.Default;
	private RoutesSettings _routesSettings { get; set; } = RoutesSettings.Default;

	public SessionParticipantFactory SetMapSettings(MapSettings mapSettings)
	{
		_mapSettings = mapSettings;
		return this;
	}

	public SessionParticipantFactory SetPlacesSettings(PlacesSettings placesSettings)
	{
		_placesSettings = placesSettings;
		return this;
	}

	public SessionParticipantFactory SetRouteSettings(RoutesSettings routesSettings)
	{
		_routesSettings = routesSettings;
		return this;
	}

	public SessionParticipant CreateSessionParticipant(Guid? guid = null)
	{
		return new SessionParticipant(
			userId: guid ?? Guid.NewGuid(),
			type: guid == null ? UserType.Participant : UserType.NonAuth,
			settings: (_mapSettings, _placesSettings, _routesSettings));
	}

	public SessionOwner CreateSessionOwner(Guid guid)
	{
		return new SessionOwner(
			userId: guid,
			settings: (_mapSettings, _placesSettings, _routesSettings));
	}
}