@echo off
echo ==============================
echo 🚀 Starting Node.js Server...
echo ==============================
start cmd /k "node index.js"

timeout /t 3 >nul

echo ==============================
echo 🌍 Opening ngrok Tunnel (Port 3000)...
echo ==============================
start cmd /k "ngrok http 3000"

echo ✅ All systems running! Press any key to exit this window.
pause >nul