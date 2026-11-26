@echo off
title Future Tech Minds 3 - Launcher
color 0A
echo.
echo  ========================================
echo    Future Tech Minds 3 - Starting...
echo  ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Python is not installed or not in PATH.
    echo  Please install Python from https://python.org
    echo.
    pause
    exit /b 1
)

echo  [OK] Python found.
echo  [>>] Starting local server on http://localhost:3000
echo  [>>] Opening browser...
echo.
echo  TIP: Keep this window open while using the app.
echo  Close this window to stop the server.
echo.

REM Open browser after a short delay (1 second)
start "" /b cmd /c "timeout /t 1 /nobreak >nul && start http://localhost:3000"

REM Start the server (blocking - keeps window alive)
python -m http.server 3000 --directory "%~dp0"
