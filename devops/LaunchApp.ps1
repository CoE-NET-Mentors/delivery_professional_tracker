$certpassword="mipassword.1";
$certpath="./";
$certfile="./dev-certificate.pfx";
#dotnet dev-certs https --clean;
#dotnet dev-certs https --export-path $certfile --password $certpassword
docker run -p 32788:443 --env Kestrel\_\_Certificates\_\_Default\_\_Path=/app/infrastructure/certificate/dev-certificate.pfx --env Kestrel\_\_Certificates\_\_Default\_\_Password=${certpassword} --env "ASPNETCORE_URLS=https://+" --volume ${certpath}:/app/infrastructure/certificate --name dptracker jrodrigav/dptracker:2025-02-03T2000
