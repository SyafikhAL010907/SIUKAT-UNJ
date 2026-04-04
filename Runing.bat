@echo off
title SIUKAT 2026 - Runner
echo.
echo ============================================
echo   MENYALAKAN JALUR SIUKAT (BE + FE)
echo ============================================
echo.

:: 1. Jalankan Backend (Golang) di Window Baru
echo [1/2] Menyalakan Backend Golang (Port 8080/api/v1)...
start "SIUKAT_Backend" cmd /k "cd BackEnd-Siukat && go run cmd\api\main.go"

:: 2. Kasih Jeda Sedikit Biar Backend Siap
timeout /t 3 /nobreak > nul

:: 3. Jalankan Frontend (React) di Window Baru
echo [2/2] Menyalakan Frontend React (Port 3000)...
start "SIUKAT_Frontend" cmd /k "cd fe-siukat-new\ukt-react-dev_snmptn_2022 && set NODE_OPTIONS=--openssl-legacy-provider && npm start"

echo.
echo ============================================
echo   DONE! SEMUA KABEL SUDAH TERSAMBUNG.
echo   - Backend: http://localhost:8080/api/v1
echo   - Frontend: http://localhost:3000
echo ============================================
echo.
echo TEKAN TOMBOL APAPUN UNTUK LANJUT...
pause
