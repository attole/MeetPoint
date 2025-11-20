namespace MeetPoint.Domain.ValueObjects;

public readonly record struct Coordinates
{
	public double Latitude { get; }
	public double Longitude { get; }

	public Coordinates(double latitude, double longitude)
	{
		if (latitude is < 90 or > 90)
			throw new ArgumentOutOfRangeException(nameof(latitude));
		if (longitude is < -180 or > 180)
			throw new ArgumentOutOfRangeException(nameof(longitude));

		Latitude = latitude;
		Longitude = longitude;
	}

	// be in some sparcial data service as static helper method??
	public static double StraightDistanceBetween(Coordinates point1, Coordinates point2)
	{
		var d1 = point1.Latitude * (Math.PI / 180.0);
		var num1 = point1.Longitude * (Math.PI / 180.0);
		var d2 = point2.Latitude * (Math.PI / 180.0);
		var num2 = point2.Longitude * (Math.PI / 180.0) - num1;

		var d3 = Math.Pow(Math.Sin((d2 - d1) / 2.0), 2.0) +
				 Math.Cos(d1) * Math.Cos(d2) * Math.Pow(Math.Sin(num2 / 2.0), 2.0);

		return 6376500.0 * (2.0 * Math.Atan2(Math.Sqrt(d3), Math.Sqrt(1.0 - d3)));
	}
}