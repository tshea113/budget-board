FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["server/MoneyMinder.csproj", "server/"]
RUN dotnet restore "server\MoneyMinder.csproj"
COPY . .
WORKDIR "/src/server"
RUN dotnet build "MoneyMinder.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "MoneyMinder.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MoneyMinder.dll"]
