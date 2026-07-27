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
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    throw "Publishing is unavailable while Git is in a detached HEAD state. Switch to a named branch first."
}
$publishingFromFeature = $currentBranch -ne "main"

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

$quotesPath = Join-Path $projectRoot "data\quotes.json"
$quotesData = @(Get-Content -LiteralPath $quotesPath -Raw | ConvertFrom-Json)
if ($quotesData.Count -eq 0) {
    throw "Vedic-text data is empty. Publishing stopped to preserve the daily footer and homepage text."
}

$watermarksPath = Join-Path $projectRoot "data\watermarks.json"
$watermarksData = Get-Content -LiteralPath $watermarksPath -Raw | ConvertFrom-Json
if ($null -eq $watermarksData.items) {
    throw "Watermark data is incomplete: 'items' must be an array."
}
foreach ($item in @($watermarksData.items)) {
    if ([string]::IsNullOrWhiteSpace($item.id) -or [string]::IsNullOrWhiteSpace($item.image)) {
        throw "Each watermark must have an id and image path."
    }
    if ([double]$item.opacity -lt 0 -or [double]$item.opacity -gt 0.3) {
        throw "Watermark '$($item.id)' has opacity outside the safe 0–0.30 range."
    }
    if ($item.visible -eq $true) {
        $watermarkAssetPath = Join-Path $projectRoot $item.image
        if (-not (Test-Path -LiteralPath $watermarkAssetPath -PathType Leaf)) {
            throw "Visible watermark '$($item.id)' refers to a missing file: '$($item.image)'."
        }
    }
}

Write-Host "`nChecking GitHub for newer commits..." -ForegroundColor Cyan
Invoke-CheckedCommand -Executable "git" -Arguments @("fetch", "origin", "main")

$behindCount = [int](& git rev-list --count "HEAD..origin/main")
if ($LASTEXITCODE -ne 0) {
    throw "Could not compare '$currentBranch' with origin/main."
}
if ($behindCount -gt 0) {
    throw "Branch '$currentBranch' is behind origin/main by $behindCount commit(s). Merge or rebase main into this branch before publishing."
}

if ($publishingFromFeature) {
    $localMainAhead = [int](& git rev-list --count "origin/main..main")
    if ($LASTEXITCODE -ne 0) {
        throw "Could not compare local main with origin/main."
    }
    if ($localMainAhead -gt 0) {
        throw "Local main contains $localMainAhead unpushed commit(s). Reconcile or push local main before publishing this feature branch."
    }
}

$status = & git status --short
if ($LASTEXITCODE -ne 0) {
    throw "Could not read Git status."
}
if (-not $status -and -not $publishingFromFeature) {
    Write-Host "`nThere are no changes to publish." -ForegroundColor Yellow
    exit 0
}

if ($status) {
    Write-Host "`nChanges that will be committed on '$currentBranch':" -ForegroundColor Cyan
    $status | ForEach-Object { Write-Host "  $_" }
}
elseif ($publishingFromFeature) {
    Write-Host "`nThere are no uncommitted files. Existing commits on '$currentBranch' will be considered for publishing." -ForegroundColor Cyan
}

$publishDescription = if ($publishingFromFeature) {
    "commit ALL changes, push '$currentBranch', merge it into main, and push main"
}
else {
    "commit and push ALL changes shown above to main"
}
$confirmation = (Read-Host "`n$publishDescription`? Type yes to continue").Trim()
if ($confirmation -ine "yes") {
    Write-Host "Publish cancelled. No files were staged or committed." -ForegroundColor Yellow
    exit 0
}

if ($status) {
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

    Write-Host "Creating commit on '$currentBranch'..." -ForegroundColor Cyan
    Invoke-CheckedCommand -Executable "git" -Arguments @("commit", "-m", $Message)
}

if ($publishingFromFeature) {
    $featureCommitCount = [int](& git rev-list --count "origin/main..HEAD")
    if ($LASTEXITCODE -ne 0 -or $featureCommitCount -eq 0) {
        throw "Branch '$currentBranch' has no commits to merge into main."
    }

    Write-Host "Pushing feature branch '$currentBranch' to GitHub..." -ForegroundColor Cyan
    Invoke-CheckedCommand -Executable "git" -Arguments @("push", "--set-upstream", "origin", $currentBranch)

    Write-Host "Updating local main..." -ForegroundColor Cyan
    Invoke-CheckedCommand -Executable "git" -Arguments @("switch", "main")
    Invoke-CheckedCommand -Executable "git" -Arguments @("pull", "--ff-only", "origin", "main")

    $mergeMessage = if ([string]::IsNullOrWhiteSpace($Message)) {
        "Merge $currentBranch"
    }
    else {
        "Merge $currentBranch - $Message"
    }
    Write-Host "Merging '$currentBranch' into main..." -ForegroundColor Cyan
    Invoke-CheckedCommand -Executable "git" -Arguments @("merge", "--no-ff", $currentBranch, "-m", $mergeMessage)
}

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
