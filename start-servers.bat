@echo off
echo Starting Inventory Management System...
echo.

echo Installing backend dependencies...
cd server
npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Starting backend server...
start "Backend Server" cmd /k "npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting frontend server...
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000 (local) / https://s72-shivamsingh-capstone-inventorymanager.onrender.com (production)
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul 