#!/bin/bash

echo "Starting Inventory Management System..."
echo

echo "Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies"
    exit 1
fi

echo
echo "Starting backend server..."
gnome-terminal --title="Backend Server" -- bash -c "npm run dev; exec bash" &
BACKEND_PID=$!

echo
echo "Waiting for backend to start..."
sleep 3

echo
echo "Starting frontend server..."
cd ..
gnome-terminal --title="Frontend Server" -- bash -c "npm run dev; exec bash" &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:5000 (local) / https://s72-shivamsingh-capstone-inventorymanager.onrender.com (production)"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop all servers..."

# Wait for user to stop
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait 