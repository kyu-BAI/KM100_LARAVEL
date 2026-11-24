@echo off
title KM100 Frontend (React Vite)
cd /d "%~dp0FRONTEND"
echo ========================================================
echo   KM100 MacroSync - React Web Application UI
echo ========================================================
echo   Portal:   http://localhost:3000
echo   Employee: http://localhost:3000/#employee
echo ========================================================
npm run dev -- --port 3000
pause
