
#Requires -Version 5
$API = $env:ROMANOTI_API
if (-not $API) { $API = "https://romanoti-tools-api.onrender.com" }
$KEY = $env:ROMANOTI_KEY
if (-not $KEY) { $KEY = "dev" }
$AGENT = $env:ROMANOTI_AGENT
if (-not $AGENT) { $AGENT = "unnamed" }

$hostname = $env:COMPUTERNAME
$platform = (Get-CimInstance Win32_OperatingSystem | Select-Object -ExpandProperty Caption)
$ip = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object {$_.IPAddress -notlike "169.*"} | Select-Object -First 1 -ExpandProperty IPAddress)
$ifaces = Get-NetIPConfiguration | ConvertTo-Json -Depth 5
$arp = arp -a | Out-String

$body = [pscustomobject]@{
  agent      = $AGENT
  hostname   = $hostname
  platform   = $platform
  local_ip   = $ip
  interfaces = (ConvertFrom-Json $ifaces)
  arp        = $arp
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Method Post -Uri "$API/client/report" `
  -Headers @{ "x-api-key" = $KEY } `
  -ContentType "application/json" `
  -Body $body

Write-Host "OK"
