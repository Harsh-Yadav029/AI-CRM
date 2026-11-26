$Host.UI.RawUI.WindowTitle = "Future Tech Minds 3 - Server"

Write-Host ""
Write-Host " ==========================================" -ForegroundColor Cyan
Write-Host "   Future Tech Minds 3 - Launching...     " -ForegroundColor Cyan
Write-Host " ==========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python
try {
    $pyver = python --version 2>&1
    Write-Host " [OK] $pyver found." -ForegroundColor Green
} catch {
    Write-Host " [ERROR] Python not found. Install from https://python.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

$port = 3000
$dir  = $PSScriptRoot

Write-Host " [>>] Starting server on http://localhost:$port" -ForegroundColor Yellow
Write-Host " [>>] Opening browser in 1 second..." -ForegroundColor Yellow
Write-Host ""
Write-Host " TIP: Keep this window open while using the app." -ForegroundColor Gray
Write-Host " Close this window to stop the server." -ForegroundColor Gray
Write-Host ""

# Open browser after 1 second in background
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 1
    Start-Process "http://localhost:3000"
} | Out-Null

# Start blocking server
Push-Location $dir
python -m http.server $port
Pop-Location
