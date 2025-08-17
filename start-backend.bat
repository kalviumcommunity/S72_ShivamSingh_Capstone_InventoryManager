@echo off
echo Starting Backend Server...
echo.

cd server
echo Installing dependencies...
npm install

echo.
echo Starting server on http://localhost:5000
echo Health check: http://localhost:5000/api/health
echo.

npm run dev 