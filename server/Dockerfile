FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG configuration=Release
WORKDIR /src
COPY . ./server
WORKDIR "/src/server"

RUN dotnet restore "BudgetBoard.WebAPI/BudgetBoard.WebAPI.csproj"
RUN dotnet build "BudgetBoard.WebAPI/BudgetBoard.WebAPI.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "BudgetBoard.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BudgetBoard.dll"]
