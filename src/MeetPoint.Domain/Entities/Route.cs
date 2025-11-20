using MeetPoint.Domain.ValueObjects;

namespace MeetPoint.Domain.Entities;

public class Route
{
	public Guid Guid { get; } = Guid.NewGuid();
	private readonly Stack<TimedCoordinates> path = [];

	public void AddToRoute(TimedCoordinates newCoordinates) =>
		path.Push(newCoordinates);

	public IEnumerable<TimedCoordinates> GetRoute() => path.Reverse();
	public TimedCoordinates? Latest => path.Count > 0 ? path.Peek() : null;
}