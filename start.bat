@echo off
echo 🚀 PathFinder - Iniciando aplicación...

REM Verificar si estamos en el directorio correcto
if not exist "backend" (
    echo ❌ Error: Ejecutar desde el directorio raíz del proyecto
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Error: Ejecutar desde el directorio raíz del proyecto
    pause
    exit /b 1
)

echo 📡 Iniciando backend (FastAPI)...
cd backend
python scripts/load_seed.py
start "PathFinder Backend" cmd /k "uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
cd ..

echo 🌐 Iniciando frontend (React + Vite)...
timeout /t 3 /nobreak >nul
cd frontend
start "PathFinder Frontend" cmd /k "npm run dev"
cd ..

echo ✅ Aplicación iniciada:
echo    Backend:  http://localhost:8000
echo    Frontend: http://localhost:5173
echo    API Docs: http://localhost:8000/docs
echo.
echo Presiona cualquier tecla para continuar...
pause >nul