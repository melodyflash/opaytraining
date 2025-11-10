@echo off
echo ========================================
echo Building with Electron
echo ========================================
echo.
echo This will create a Windows installer and portable exe
echo Output will be in dist/ folder
echo.
echo NOTE: Development mode may not work, but the build should succeed
echo.
pause

echo Building...
call npm run build:win

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Check dist/ folder for:
echo  - OrderPay Training Setup.exe (Installer ~200-250MB)
echo  - OrderPay Training.exe (Portable ~200-250MB)
echo.
pause
