namespace MeetPoint.Domain.ValueObjects;

public readonly record struct TimedCoordinates
{
	public Coordinates Coordinates { get; }
	public DateTime Timestamp { get; }

	public TimedCoordinates(Coordinates coordinates, DateTime? dateTime = null)
	{
		var timestamp = dateTime ?? DateTime.UtcNow;

		if (timestamp.Kind == DateTimeKind.Unspecified)
			throw new FormatException($"{nameof(dateTime)} must be either UTC or local.");

		Coordinates = coordinates;
		Timestamp = timestamp;
	}
}