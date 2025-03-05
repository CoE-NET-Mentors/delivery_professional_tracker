$certpassword="mipassword.1";
$certpath="${PWD}";
$certfile="./dev-certificate.pfx";
#dotnet dev-certs https --clean;
#dotnet dev-certs https --export-path $certfile --password $certpassword
docker run --publish 32788:443 --rm `
                        --env "Kestrel__Certificates__Default__Path=/app/infrastructure/certificate/dev-certificate.pfx" `
                        --env "Kestrel__Certificates__Default__Password=${certpassword}" `
                        --env "ASPNETCORE_URLS=https://+" `
                        --env "AzureAd__Instance=https://login.microsoftonline.com/" `
                        --env "AzureAd__Domain=unosquare.com" `
                        --env "AzureAd__TenantId=REPLACEME" `
                        --env "AzureAd__ClientId=REPLACEME" `
                        --env "AzureAd__ClientSecret=REPLACEME" `
                        --env "AzureAd__SecretId=REPLACEME" `
                        --env "Graph_BaseUrl=https://graph.microsoft.com/v1.0" `
                        --env "Graph__Scopes=user.readbasic.all" `
                        --env "ASPNETCORE_ENVIRONMENT=QA" `
                        --volume ${certpath}:/app/infrastructure/certificate `
                        --name dptracker jrodrigoav/dptracker:latest 
