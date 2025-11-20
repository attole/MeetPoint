using MeetPoint.Domain.Enums;
using MeetPoint.Domain.ValueObjects;

namespace MeetPoint.Domain.Entities;

public class Place
{
	public Guid Id { get; }

	private string _name = null!;
	public string Name
	{
		get => _name;
		private set
		{
			if (string.IsNullOrWhiteSpace(value))
				throw new ArgumentNullException(nameof(Name));
			if (value.Length < 3 || value.Length > 25)
				throw new ArgumentException($"{nameof(Name)} length must be between 3 and 25 characters.");

			_name = value;
			LastUpdated = DateTime.Now;
		}
	}

	public PlaceType Type { get; private set; }
	public WeeklySchedule WeeklySchedule { get; private set; }

	public string _address = null!;
	public string Address
	{
		get => _address;
		private set
		{
			if (string.IsNullOrWhiteSpace(value))
				throw new ArgumentNullException(nameof(Address));
			if (value.Length is < 3 or > 50)
				throw new ArgumentOutOfRangeException(nameof(Address));

			_address = value;
			LastUpdated = DateTime.UtcNow;
		}
	}

	public Coordinates Coordinates { get; private set; }

	public string? Link { get; private set; }

	private double _rating = double.NaN;
	public double Rating
	{
		get => _rating;
		private set
		{
			if (value is < 1.0 or > 5.0)
				throw new ArgumentOutOfRangeException(nameof(Rating));

			_rating = value;
			LastUpdated = DateTime.UtcNow;
		}
	}

	private double _price = double.NaN;
	public double Price
	{
		get => _price;
		private set
		{
			if (value is < 1.0 or > 5.0)
				throw new ArgumentOutOfRangeException(nameof(Price));

			_price = value;
			LastUpdated = DateTime.UtcNow;
		}
	}


	/* 
		add other data like image
		public string ImageUrl { get; private set; } and data in blob storage
		public byte[] ImageData { get; private set; } or just image bytes
	*/

	private DateTime LastUpdated { get; set; }
	private static readonly TimeSpan UpdateThreshold = TimeSpan.FromDays(3);

	public Place(string name, PlaceType placeType, string address, Coordinates? coordinates, WeeklySchedule weeklySchedule, string? link)
	{
		Id = Guid.NewGuid();
		Name = name;
		Type = placeType;
		Address = address;
		Coordinates = coordinates ?? new Coordinates();
		WeeklySchedule = weeklySchedule;
		Link = link;
		LastUpdated = DateTime.UtcNow;
	}

	public bool NeedsUpdate() => DateTime.UtcNow - LastUpdated > UpdateThreshold;

	public bool UpdateFrom(string name, string address, WeeklySchedule weeklySchedule, string? link, double rating, double price)
	{
		var changed = false;

		void UpdateIfDifferent<T>(T current, T updated, Action<T> setter)
		{
			if (!EqualityComparer<T>.Default.Equals(current, updated))
			{

				setter(updated);
				changed = true;
			}
		}

		UpdateIfDifferent(Name, name, value => Name = value);
		UpdateIfDifferent(Address, address, value => Address = value);
		UpdateIfDifferent(WeeklySchedule, weeklySchedule, value => WeeklySchedule = value);
		UpdateIfDifferent(Link, link, value => Link = value);
		UpdateIfDifferent(Rating, rating, value => Rating = value);
		UpdateIfDifferent(Price, price, value => price = value);

		return changed;
	}
}