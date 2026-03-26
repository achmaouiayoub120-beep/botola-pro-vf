@echo off
color 0B
title (PFE) Start - Botola Pro Inwi
echo ========================================================
echo   LANCEMENT DU PROJET BOTOLA PRO INWI (PFE)
echo ========================================================
echo.

echo S'assurez-vous que le serveur MySQL (XAMPP/WAMP) est demarre.
echo Appuyez sur une touche pour lancer l'application...
pause >nul

echo.
echo [1/2] Demarrage du Backend sur le port 5000...
start "BOTOLA BACKEND (API)" cmd /c "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo [2/2] Demarrage du Frontend Vite (React) sur le port 8090...
start "BOTOLA FRONTEND (UI)" cmd /c "npm run dev"

echo.
echo ========================================================
echo Le projet est en cours de lancement !
echo La page web va s'ouvrir automatiquement dans ========================================================
timeout /t 3 /nobreak >nul
start http://localhost:8090
