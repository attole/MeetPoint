using System.Collections.ObjectModel;

namespace MeetPoint.Domain.ValueObjects;

public readonly record struct WeeklySchedule
{
	public IReadOnlyDictionary<DayOfWeek, Range<TimeOnly>> Days { get; }

	public WeeklySchedule(IDictionary<DayOfWeek, Range<TimeOnly>> days)
	{
		if (days == null || days.Count != 7)
			throw new ArgumentException("A schedule must contain 7 days.");

		Days = new ReadOnlyDictionary<DayOfWeek, Range<TimeOnly>>(days);
	}

	public Range<TimeOnly> GetScheduleForDay(DayOfWeek day) => Days[day];
}