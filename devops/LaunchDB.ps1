docker run --env "ACCEPT_EULA=Y" --env "MSSQL_SA_PASSWORD=MiPassword.Mamalon1" --publish 1433:1433 --detach --name localsql mcr.microsoft.com/mssql/server:2022-latest
