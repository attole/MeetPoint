namespace MeetPoint.Domain.ValueObjects;

public static class RangeConstants
{
	public readonly static Range<double> ScoreRange = Range.Create(0.0, 5.0);
	public readonly static Range<TimeSpan> DayTimeRange = Range.Create(TimeSpan.Zero, TimeSpan.FromDays(1));
	public readonly static Range<int> MoneyRange = Range.Create(0, int.MaxValue);
}