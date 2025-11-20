namespace MeetPoint.Domain.ValueObjects;

public readonly struct Range<T> where T : struct, IComparable<T>
{
	public readonly T Max;
	public readonly T Min;

	internal Range(T Min, T Max)
	{
		if (Min.CompareTo(Max) > 0)
			throw new FormatException("Min cannot be bigger than max");

		this.Min = Min;
		this.Max = Max;
	}

	public readonly bool IsInRange(T value) => value.CompareTo(Min) >= 0 && value.CompareTo(Max) <= 0;
	public readonly bool Overlaps(Range<T> range) => Min.CompareTo(range.Max) <= 0 && Max.CompareTo(range.Min) >= 0;
}


public static class Range
{
	public static Range<T> Create<T>(T start, T end) where T : struct, IComparable<T>
	{
		if (start.CompareTo(end) > 0)
			return new Range<T>(end, start);

		return new Range<T>(start, end);
	}
}