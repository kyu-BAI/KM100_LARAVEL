@echo off
title KM100 MacroSync Launcher
echo ========================================================
echo   Launching KM100 MacroSync (Backend + Frontend)
echo ========================================================
start "KM100 Backend (Port 8000)" "%~dp0start-backend.bat"
start "KM100 Frontend (Port 3000)" "%~dp0start-frontend.bat"
where ngrok >nul 2>&1
if %errorlevel%==0 (
  start "KM100 ngrok Tunnel" ngrok http --url=steam-cannot-unluckily.ngrok-free.dev 8000
  echo   - Public API Tunnel: https://steam-cannot-unluckily.ngrok-free.dev
) else (
  echo   - [Note] ngrok not found in PATH. Install ngrok to enable public tunnel.
)
echo Servers are launching in separate windows!
echo   - Backend REST API:  http://127.0.0.1:8000
echo   - Frontend Web App:  http://localhost:3000
echo Opening browser in 5 seconds...
timeout /t 5 >nul
start http://localhost:3000
