FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dev
WORKDIR /app/src

COPY ["src/MeetPoint.API/MeetPoint.API.csproj", "MeetPoint.API/"]
COPY ["src/MeetPoint.Application/MeetPoint.Application.csproj", "MeetPoint.Application/"]
COPY ["src/MeetPoint.Domain/MeetPoint.Domain.csproj", "MeetPoint.Domain/"]
COPY ["src/MeetPoint.Infrastructure/MeetPoint.Infrastructure.csproj", "MeetPoint.Infrastructure/"]

RUN dotnet restore "MeetPoint.API/MeetPoint.API.csproj"

COPY src .
WORKDIR /app/src/MeetPoint.API

CMD ["dotnet", "watch", "run", "--no-launch-profile"]