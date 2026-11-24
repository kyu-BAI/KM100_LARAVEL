@echo off
title KM100 Supabase-to-MySQL Data Migration
cd /d "%~dp0BACKEND"
set "PATH=C:\laragon\bin\php\php-8.3.37-Win32-vs16-x64;C:\laragon\bin\composer;C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin;%PATH%"

echo ===================================================================
echo     KM100 MacroSync - Supabase to MySQL Data Migration Tool
echo ===================================================================
echo.
echo Choose your import method:
echo   [1] Direct live sync via Supabase URL and API Key
echo   [2] Import from existing local JSON file (storage/app/migration/...)
echo   [3] Test migration in DRY-RUN mode (safe simulation)
echo.
set /p choice="Enter choice (1, 2, or 3): "

if "%choice%"=="1" goto live_sync
if "%choice%"=="2" goto file_import
if "%choice%"=="3" goto dry_run
goto invalid

:live_sync
echo.
set /p sb_url="Enter Supabase Project URL (e.g. https://xyz.supabase.co): "
set /p sb_key="Enter Supabase API Key (service_role or anon key): "
if "%sb_url%"=="" goto empty_err
if "%sb_key%"=="" goto empty_err
echo.
echo Connecting to %sb_url% and transferring data to MySQL...
php artisan km100:import-supabase --url="%sb_url%" --key="%sb_key%"
goto finish

:file_import
echo.
set /p file_path="Enter path to JSON file (or press Enter for default migration dump): "
if "%file_path%"=="" set file_path=storage/app/migration/supabase_export_20261123_160214.json
echo Importing from %file_path% into MySQL...
php artisan km100:import-supabase --file="%file_path%"
goto finish

:dry_run
echo.
set /p file_path="Enter path to JSON file (or press Enter for default migration dump): "
if "%file_path%"=="" set file_path=storage/app/migration/supabase_export_20261123_160214.json
echo Simulating migration from %file_path% (no database changes)...
php artisan km100:import-supabase --file="%file_path%" --dry-run
goto finish

:empty_err
echo Error: Both Supabase URL and Key are required for live sync.
goto finish

:invalid
echo Invalid selection.
goto finish

:finish
echo.
echo ===================================================================
echo Process complete.
pause
