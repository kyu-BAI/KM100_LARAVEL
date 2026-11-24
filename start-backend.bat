@echo off
title KM100 Backend Server (Laravel)
cd /d "%~dp0BACKEND"
set "PATH=C:\laragon\bin\php\php-8.3.37-Win32-vs16-x64;C:\laragon\bin\composer;C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin;%PATH%"
echo ========================================================
echo   KM100 MacroSync - Laravel Backend REST API
echo ========================================================
echo   API URL:  http://127.0.0.1:8000
echo   Health:   http://127.0.0.1:8000/api/v1/health
echo ========================================================
php artisan serve --host=127.0.0.1 --port=8000
pause
