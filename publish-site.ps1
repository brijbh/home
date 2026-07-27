[CmdletBinding()]
param(
    [string]$Message,
    [switch]$DirectVercelDeploy
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Invoke-CheckedCommand {
    param(
        [Parameter(Mandatory)]
        [string]$Executable,

        [Parameter(Mandatory)]
        [string[]]$Arguments
    )

    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "'$Executable $($Arguments -join ' ')' failed with exit code $LASTEXITCODE."
    }
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $projectRoot

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git is not installed or is not available in PATH."
}

$insideRepository = & git rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0 -or $insideRepository -ne "true") {
    throw "'$projectRoot' is not a Git repository."
}

$currentBranch = (& git branch --show-current).Trim()
if ($currentBranch -ne "main") {
    throw "Publishing is allowed only from 'main'. Current branch: '$currentBranch'."
}

Write-Host "Validating website JSON..." -ForegroundColor Cyan
Get-ChildItem -LiteralPath (Join-Path $projectRoot "data") -Filter "*.json" |
    ForEach-Object {
        try {
            Get-Content -LiteralPath $_.FullName -Raw | ConvertFrom-Json | Out-Null
            Write-Host "  OK  $($_.Name)"
        }
        catch {
            throw "Invalid JSON in '$($_.FullName)': $($_.Exception.Message)"
        }
    }

$aboutPath = Join-Path $projectRoot "data\about.json"
$aboutData = Get-Content -LiteralPath $aboutPath -Raw | ConvertFrom-Json
$requiredAboutArrays = @("capabilities", "domains", "career", "independentProducts", "process", "workbench", "craft")
foreach ($property in $requiredAboutArrays) {
    $value = $aboutData.PSObject.Properties[$property].Value
    if ($null -eq $value -or $value.Count -eq 0) {
        throw "About data is incomplete: '$property' is missing or empty. Publishing stopped to prevent blank About sections."
    }
}

Write-Host "`nChecking GitHub for newer commits..." -ForegroundColor Cyan
Invoke-CheckedCommand -Executable "git" -Arguments @("fetch", "origin", "main")

$behindCount = [int](& git rev-list --count "HEAD..origin/main")
if ($LASTEXITCODE -ne 0) {
    throw "Could not compare local main with origin/main."
}
if ($behindCount -gt 0) {
    throw "Local main is behind origin/main by $behindCount commit(s). Pull/reconcile those changes before publishing."
}

$status = & git status --short
if ($LASTEXITCODE -ne 0) {
    throw "Could not read Git status."
}
if (-not $status) {
    Write-Host "`nThere are no changes to publish." -ForegroundColor Yellow
    exit 0
}

Write-Host "`nChanges that will be committed:" -ForegroundColor Cyan
$status | ForEach-Object { Write-Host "  $_" }

$confirmation = (Read-Host "`nCommit and push ALL changes shown above to main? Type yes to continue").Trim()
if ($confirmation -ine "yes") {
    Write-Host "Publish cancelled. No files were staged or committed." -ForegroundColor Yellow
    exit 0
}

if ([string]::IsNullOrWhiteSpace($Message)) {
    $Message = Read-Host "Commit message"
}
if ([string]::IsNullOrWhiteSpace($Message)) {
    throw "A commit message is required."
}

Write-Host "`nStaging changes..." -ForegroundColor Cyan
Invoke-CheckedCommand -Executable "git" -Arguments @("add", "--all")

$stagedFiles = & git diff --cached --name-only
if ($LASTEXITCODE -ne 0 -or -not $stagedFiles) {
    throw "No changes were staged."
}

Write-Host "Creating commit..." -ForegroundColor Cyan
Invoke-CheckedCommand -Executable "git" -Arguments @("commit", "-m", $Message)

Write-Host "Pushing main to GitHub..." -ForegroundColor Cyan
Invoke-CheckedCommand -Executable "git" -Arguments @("push", "origin", "main")

if ($DirectVercelDeploy) {
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        throw "Git push succeeded, but the Vercel CLI is not installed or is unavailable in PATH."
    }

    Write-Host "Starting an additional direct Vercel production deployment..." -ForegroundColor Cyan
    Invoke-CheckedCommand -Executable "vercel" -Arguments @("--prod")
}
else {
    Write-Host "`nGitHub push completed." -ForegroundColor Green
    Write-Host "Vercel will deploy automatically from main."
}
