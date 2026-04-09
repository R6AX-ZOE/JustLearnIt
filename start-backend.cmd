@echo off
echo ========================================
echo Starting Backend Server with Logs
echo ========================================
echo.
echo Backend logs will appear below:
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Kill existing server on port 3002
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002 ^| findstr LISTENING') do (
    echo Stopping existing server (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo.
echo Starting new server...
echo.

node server.js
