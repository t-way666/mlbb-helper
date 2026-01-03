@echo off
echo Starting MLBB Helper Fullstack (Backend + Frontend)...

:: Запуск бэкенда в новом окне
start cmd /k "echo Backend Log: && cd backend && .\.venv\Scripts\python.exe app.py"

:: Запуск фронтенда в текущем окне
echo Starting Frontend...
cd frontend
npm run dev
