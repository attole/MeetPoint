namespace MeetPoint.Domain.Entities;

class Session
{
	public Guid Id { get; }
	public string Code { get; } = null!;
	public DateTime CreatedAt { get; private set; } //created.Kind == DateTimeKind.Unspecified
}