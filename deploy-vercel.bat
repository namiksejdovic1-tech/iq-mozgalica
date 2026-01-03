@echo off
REM IQPlay - Deploy to Vercel (FREE)

echo ========================================
echo  IQPlay - Deploying to Vercel
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not installed!
    echo Please install from: https://nodejs.org
    pause
    exit /b 1
)

REM Install Vercel CLI globally
echo [1/3] Installing Vercel CLI...
call npm install -g vercel

echo.
echo [2/3] Logging into Vercel...
echo Please complete authentication in your browser...
call vercel login

echo.
echo [3/3] Deploying to production...
call vercel --prod

echo.
echo ========================================
echo  DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app is now LIVE!
echo.
echo Next: Generate APK
echo   Run: generate-apk.bat
echo   Or visit: https://www.pwabuilder.com
echo.
pause
