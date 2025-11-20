using System.Text.RegularExpressions;

namespace MeetPoint.Domain.Entities;

public partial class User
{
    public Guid Id { get; }

    private string? _name;
    public string? Name
    {
        get => _name;
        set
        {
            if (value != null && !value.All(char.IsLetter))
                throw new ArgumentException($"{nameof(Name)} includes only letters.");
            if (value != null && value.Length > 15)
                throw new ArgumentException($"{nameof(Name)} cannot be longer than 15 letters.");
            _name = value;
        }
    }

    private string? _surname;
    public string? Surname
    {
        get => _surname;
        set
        {
            if (value != null && !value.All(char.IsLetter))
                throw new ArgumentException($"{nameof(Surname)} includes only letters.");
            if (value != null && value.Length > 15)
                throw new ArgumentException($"{nameof(Surname)} cannot be longer than 15 letters.");
            _surname = value;
        }
    }

    private string _username = null!;
    public string Username
    {
        get => _username;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentNullException(nameof(Username));
            if (value.Length is <= 3 or > 15)
                throw new ArgumentException($"{nameof(Username)} length must be between 3 and 15 characters.");
            _username = value;
        }
    }

    private string? _alias;
    public string? Alias
    {
        get => _alias;
        set
        {
            if (value != null && value.Length > 10)
                throw new ArgumentException($"{nameof(Alias)} cannot be longer than 10 characters.");
            _alias = value;
        }
    }

    private string _email = null!;
    public string Email
    {
        get => _email;
        set
        {
            if (value == null)
                throw new ArgumentNullException(nameof(Email));
            if (!EmailRegex().IsMatch(value))
                throw new FormatException($"{nameof(Email)} must be in a valid format.");
            _email = value;
        }
    }

    private bool _emailVerified;
    public bool EmailVerified
    {
        get => _emailVerified;
        set => _emailVerified = value;
    }

    private string? _phoneNumber;
    public string? PhoneNumber
    {
        get => _phoneNumber;
        set
        {
            if (value != null && !PhoneNumberRegex().IsMatch(value))
                throw new FormatException($"{nameof(PhoneNumber)} number must be in a valid international format.");
            _phoneNumber = value;
        }
    }

    /* 
		add other data like image
		public string ImageUrl { get; private set; } and data in blob storage
		public byte[] ImageData { get; private set; } or just image bytes
	*/

    public ISet<Guid> Friends { get; private set; }

    public User(string username, string email, string? phoneNumber, string? alias, string? name, string? surname, ISet<Guid> friends = null!)
    {
        Id = Guid.NewGuid();
        Username = username;
        Email = email;

        EmailVerified = false;
        //event to verify email

        Name = name;
        Surname = surname;
        Alias = alias;
        PhoneNumber = phoneNumber;
        Friends = friends ?? new HashSet<Guid>();
    }

    [GeneratedRegex(@"^\+?\d{10,15}$")]
    private static partial Regex PhoneNumberRegex();

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
    private static partial Regex EmailRegex();
}
