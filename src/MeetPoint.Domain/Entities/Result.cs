namespace MeetPoint.Domain.Entities;

public class Result
{
    public bool Succeded { get; init; }
    public List<Exception>? Errors { get; init; }

    public static Result Success => new Result { Succeded = true };

    public static Result Failure(params Exception[] errors)
        => new Result { Succeded = false, Errors = [.. errors] };

    public static Result Failure(IEnumerable<Exception> errors)
        => new Result { Succeded = false, Errors = [.. errors] };

    public override string ToString()
        => Succeded ? "Success" : $"Failure: {string.Join("; ", Errors!)}";
}

public class Result<T>
{
    private T? _value { get; init; }
    public T Value
    {
        get
        {
            Errors?.ForEach(error => throw error);
            return _value!;
        }
    }
    public bool Succeded { get; init; }
    public List<Exception>? Errors { get; init; }

    public T? ValueOrDefault => _value ?? default;

    public static Result<T> Failure(params Exception[] errors)
        => new Result<T> { Succeded = false, Errors = [.. errors] };

    public static Result<T> Failure(IEnumerable<Exception> errors)
        => new Result<T> { Succeded = false, Errors = [.. errors] };

    public static Result<T> FromValue(T? value) => value != null
        ? new Result<T> { Succeded = true, _value = value }
        : Result<T>.Failure(new NullReferenceException());



    public override string ToString()
        => Succeded ? $"Succedded, value: {Value}" : $"Failure: {string.Join("; ", Errors!)}";
}
