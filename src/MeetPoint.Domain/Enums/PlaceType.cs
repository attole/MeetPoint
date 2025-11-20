namespace MeetPoint.Domain.Enums;

public enum PlaceType
{
    Cafe,
    Restaurant,
    Mall,
    Cinema,
    Market,
    Bar,
    Club,
    Park,
    Gym,
    ProductsStore,
    Shop
}

#nullable disable
public class SessionSettings
{
    public string[] placeFilter { get; set; }
    public bool allow_others_to_propose_places { get; set; }
}

public class SessionMeta
{
    public string type { get; set; }
}
