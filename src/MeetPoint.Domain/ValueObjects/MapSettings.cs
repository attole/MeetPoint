namespace MeetPoint.Domain.ValueObjects;

public readonly record struct MapSettings(MapSettings.Participants ParticipantsSettings, bool ViewGeoCenter)
{
	public static readonly MapSettings Default = new(
		new Participants(true, new Participants.Details(true, true, true)), true);

	public record Participants
	{
		public bool Enabled { get; set; }

		private readonly Details _settings;
		public Details? Settings => Enabled ? _settings : null;

		public Participants(bool enabled, Details settings)
		{
			Enabled = enabled;
			_settings = settings;
		}

		public readonly record struct Details(bool ViewDistance, bool ViewUpdatedTime, bool ViewIcons);
	}
}