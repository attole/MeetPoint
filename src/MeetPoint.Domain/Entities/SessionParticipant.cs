using MeetPoint.Domain.Enums;
using MeetPoint.Domain.ValueObjects;

namespace MeetPoint.Domain.Entities;

public class SessionParticipant
{
	public Guid Id { get; }
	public UserType Type { get; }
	public MapSettings MapSettings { get; set; }
	public PlacesSettings PlacesSettings { get; set; }
	public RoutesSettings RoutesSettings { get; set; }
	public TimedCoordinates CurrentCoordinates { get; private set; } //= new TimedCoordinates(currentCoordinates);


	internal SessionParticipant(Guid userId, UserType type, (MapSettings, PlacesSettings, RoutesSettings) settings)
	{
		Id = userId;
		Type = type;
		(MapSettings, PlacesSettings, RoutesSettings) = settings;
	}

	public void UpdateCoordinates(TimedCoordinates newCoordinates)
	{
		if (!newCoordinates.Equals(CurrentCoordinates))
		{
			CurrentCoordinates = newCoordinates;
			//fire event on change
		}

		//update path route
	}

}

