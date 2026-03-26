@echo off
color 0C
title (PFE) Arrêt - Botola Pro Inwi
echo ========================================================
echo   ARRET DES SERVEURS Node.js
echo ========================================================
echo.
echo Fermeture des processus node.exe en cours...
taskkill /F /IM node.exe
echo.
echo Serveurs arretes.
pause
