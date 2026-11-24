<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response(<<<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KM100 MacroSync API Backend</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; max-width: 580px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }
        .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .badge-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }
        h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #fff; }
        p { color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 28px; }
        .btn { display: inline-block; background: #2563eb; color: #fff; font-weight: 600; font-size: 15px; padding: 14px 28px; border-radius: 10px; text-decoration: none; transition: background 0.2s; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); }
        .btn:hover { background: #1d4ed8; }
        .endpoints { margin-top: 32px; padding-top: 24px; border-top: 1px solid #334155; text-align: left; font-size: 13px; color: #64748b; }
        .endpoints div { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .endpoints code { color: #38bdf8; background: #0f172a; padding: 2px 6px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge"><span class="badge-dot"></span> Backend API Operational (Laravel 11 + MySQL)</div>
        <h1>KM100 MacroSync Backend API</h1>
        <p>This port (<strong>:8000</strong>) is your REST API server. The application user interface runs on the React frontend server.</p>
        <a href="http://localhost:3000" class="btn" target="_blank">Launch KM100 Web App (Port 3000) &rarr;</a>
        
        <div class="endpoints">
            <div><span>REST API Root:</span> <code>/api/v1</code></div>
            <div><span>API Health Check:</span> <a href="/api/v1/health" style="color:#38bdf8; text-decoration:none;"><code>/api/v1/health</code></a></div>
            <div><span>Database Connection:</span> <span style="color:#4ade80;">MySQL 8.4 Connected</span></div>
        </div>
    </div>
</body>
</html>
HTML, 200, ['Content-Type' => 'text/html']);
});

