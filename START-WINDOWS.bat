@echo off
REM Maaz AI Wala — double-click to run the website locally.
cd /d "%~dp0"
echo.
echo  Maaz AI Wala - starting...
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo  Node.js is not installed. Download the LTS version from https://nodejs.org and run this file again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo  Installing packages ^(first time only, takes a few minutes^)...
  call npm install
)
echo.
echo  Open http://localhost:3000 in Chrome. Press Ctrl+C in this window to stop.
echo.
call npm run dev
pause
