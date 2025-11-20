using System.Collections.Immutable;
using MeetPoint.Domain.Enums;

namespace MeetPoint.Domain.ValueObjects;

public readonly record struct RoutesSettings(IImmutableList<VehicleType> VehicleTypes, Range<int> Price, Range<TimeSpan> Time)
{
	public static readonly RoutesSettings Default = new(
		[
			VehicleType.Bus,
			VehicleType.Subway,
			VehicleType.Tram
		],
		RangeConstants.MoneyRange,
		RangeConstants.DayTimeRange);
}