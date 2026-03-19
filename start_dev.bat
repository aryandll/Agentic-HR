@echo off
echo Starting Backend...
start "Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Starting Frontend...
start "Frontend" cmd /k "npm run dev"

echo Services starting in new windows.
