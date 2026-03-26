@echo off
color 0A
title (PFE) Installation - Botola Pro Inwi
echo ========================================================
echo   BOTOLA PRO INWI - INSTALLATION DES DEPENDANCES
echo ========================================================
echo.

echo [1/2] Installation des modules pour le Backend (Node.js/Express)...
cd backend
cmd /c npm install
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo Erreur lors de l'installation du Backend!
    pause
    exit /b 1
)
cd ..
echo [OK] Backend pret.
echo.

echo [2/2] Installation des modules pour le Frontend (React/Vite)...
cmd /c npm install
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo Erreur lors de l'installation du Frontend!
    pause
    exit /b 1
)
echo [OK] Frontend pret.
echo.

echo ========================================================
echo INSTALLATION TERMINEE AVEC SUCCES!
echo Vous pouvez maintenant utiliser start-project.bat
echo ========================================================
pause
