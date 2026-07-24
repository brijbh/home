[CmdletBinding()]
param(
    [ValidateRange(1, 65535)]
    [int]$Port = 8080,

    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = Get-Command python -ErrorAction SilentlyContinue

if (-not $python) {
    throw "Python is not installed or is not available in PATH."
}

function Get-LanIPv4Address {
    $configurations = @(
        Get-NetIPConfiguration |
            Where-Object {
                $_.NetAdapter.Status -eq "Up" -and
                $_.IPv4DefaultGateway -and
                $_.IPv4Address
            }
    )

    $preferred = $configurations |
        Where-Object { $_.InterfaceAlias -match "Wi-?Fi|Wireless|WLAN" } |
        Select-Object -First 1

    if (-not $preferred) {
        $preferred = $configurations | Select-Object -First 1
    }

    if (-not $preferred) {
        return $null
    }

    $address = $preferred.IPv4Address |
        Where-Object {
            $_.IPAddress -notmatch "^127\." -and
            $_.IPAddress -notmatch "^169\.254\."
        } |
        Select-Object -First 1

    if (-not $address) {
        return $null
    }

    return $address.IPAddress
}

function Test-LocalPort {
    param([int]$PortNumber)

    $listener = Get-NetTCPConnection -State Listen -LocalPort $PortNumber -ErrorAction SilentlyContinue |
        Select-Object -First 1

    return $listener
}

$localAdmin = "http://127.0.0.1:$Port/admin.html"
$localSite = "http://127.0.0.1:$Port/"
$computerName = $env:COMPUTERNAME.ToLowerInvariant()
$lanAddress = Get-LanIPv4Address

Write-Host ""
Write-Host "Git Home local server" -ForegroundColor Cyan
Write-Host "Project: $projectRoot"
Write-Host ""
Write-Host "This computer" -ForegroundColor Cyan
Write-Host "  Site:  $localSite"
Write-Host "  Admin: $localAdmin"

if ($lanAddress) {
    Write-Host ""
    Write-Host "Other devices on the same Wi-Fi" -ForegroundColor Cyan
    Write-Host "  Site:  http://${lanAddress}:$Port/"
    Write-Host "  Admin: http://${lanAddress}:$Port/admin.html"
    Write-Host ""
    Write-Host "Hostname address (when supported by your router/device)" -ForegroundColor Cyan
    Write-Host "  Site:  http://${computerName}:$Port/"
    Write-Host "  Admin: http://${computerName}:$Port/admin.html"
}
else {
    Write-Host ""
    Write-Warning "A LAN IPv4 address could not be detected. Local access will still work."
}

$existingListener = Test-LocalPort -PortNumber $Port
if ($existingListener) {
    $processName = "unknown process"
    try {
        $processName = (Get-Process -Id $existingListener.OwningProcess -ErrorAction Stop).ProcessName
    }
    catch {
        # The process may have exited between the port and process checks.
    }

    Write-Host ""
    Write-Warning "Port $Port is already in use by $processName (PID $($existingListener.OwningProcess)). A second server was not started."

    if (-not $NoBrowser) {
        Start-Process $localAdmin
    }

    exit 0
}

if (-not $NoBrowser) {
    Start-Process $localAdmin
}

Write-Host ""
Write-Host "Starting the server. Press Ctrl+C in this window to stop it." -ForegroundColor Green
Write-Host "If Windows Firewall asks, allow Python only on Private networks." -ForegroundColor Yellow
Write-Host ""

Set-Location -LiteralPath $projectRoot
& $python.Source -m http.server $Port --bind 0.0.0.0 --directory $projectRoot

if ($LASTEXITCODE -ne 0) {
    throw "The Git Home server stopped with exit code $LASTEXITCODE."
}
