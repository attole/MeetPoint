using System.Collections.Immutable;
using MeetPoint.Domain.Enums;

namespace MeetPoint.Domain.ValueObjects;

public readonly record struct PlacesSettings(IImmutableList<PlaceType> Types, Range<double> Rating, Range<int> Price)
{
	public static readonly PlacesSettings Default = new(
		[
			PlaceType.Cafe,
				PlaceType.Restaurant,
				PlaceType.Shop,
				PlaceType.ProductsStore
		],
		RangeConstants.ScoreRange,
		RangeConstants.MoneyRange);
}