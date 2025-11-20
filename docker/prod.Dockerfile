FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["src/MeetPoint.API/MeetPoint.API.csproj", "MeetPoint.API/"]
COPY ["src/MeetPoint.Application/MeetPoint.Application.csproj", "MeetPoint.Application/"]
COPY ["src/MeetPoint.Domain/MeetPoint.Domain.csproj", "MeetPoint.Domain/"]
COPY ["src/MeetPoint.Infrastructure/MeetPoint.Infrastructure.csproj", "MeetPoint.Infrastructure/"]

RUN dotnet restore "MeetPoint.API/MeetPoint.API.csproj"

COPY src .
WORKDIR "MeetPoint.API"
RUN dotnet build "MeetPoint.API.csproj" -c Debug -o /app/build

FROM build AS publish
RUN dotnet publish "MeetPoint.API.csproj" -c Debug -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MeetPoint.API.dll"]
