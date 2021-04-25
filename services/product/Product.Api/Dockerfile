#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["services/product/Product.Api/Product.Api.csproj", "services/product/Product.Api/"]
COPY ["lib/eventbus/Zero.EventBus/Zero.EventBus.csproj", "lib/eventbus/Zero.EventBus/"]
COPY ["lib/core/Zero.Core/Zero.Core.csproj", "lib/core/Zero.Core/"]
RUN dotnet restore "services/product/Product.Api/Product.Api.csproj"
COPY . .
WORKDIR "/src/services/product/Product.Api"
RUN dotnet build "Product.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Product.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Product.Api.dll"]