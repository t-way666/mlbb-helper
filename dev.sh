#!/bin/bash

# Функция для убийства процессов при выходе
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Перехватываем сигнал прерывания (Ctrl+C)
trap cleanup SIGINT

echo "Setting up Backend environment..."
cd backend

# Проверяем, существует ли виртуальное окружение для Linux
if [ ! -d "venv" ]; then
    echo "Creating python virtual environment..."
    python3 -m venv venv
    echo "Installing requirements..."
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Запускаем бэкенд в фоне
echo "Starting Backend (Flask)..."
python3 app.py &
BACKEND_PID=$!
cd ..

# Запускаем фронтенд
echo "Starting Frontend (Next.js)..."
cd frontend
npm run dev

# Ждем завершения процессов
wait $BACKEND_PID
