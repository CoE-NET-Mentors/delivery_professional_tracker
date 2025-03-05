FROM node:23.9.0 AS frontendcache
WORKDIR /build/frontend
COPY DPTracker/frontend-react/package.json .
RUN npm install --force
FROM frontendcache AS frontend
COPY DPTracker/frontend-react/ .
RUN npm run build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend
WORKDIR /build/backend
COPY DPTracker/ .
RUN dotnet publish --configuration Release --output publish
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=backend /build/backend/publish .
COPY --from=frontend /build/wwwroot/ ./wwwroot
EXPOSE 80
EXPOSE 443
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_HTTP_PORTS=80
ENV ASPNETCORE_HTTPS_PORTS=443
ENTRYPOINT ["dotnet", "DPTracker.dll"]