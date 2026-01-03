@echo off
REM IQPlay Brain Games - Windows Deploy Script

echo ========================================
echo  IQPlay Brain Games - Deployment
echo ========================================
echo.

REM Check Node.js installation
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not installed!
    echo.
    echo Please install Node.js from https://nodejs.org
    echo Recommended: LTS version 18+
    echo.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Install dependencies
echo [1/5] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Dependencies installed successfully!
echo.

REM Check for Railway CLI
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Railway CLI not found. Installing...
    call npm install -g @railway/cli
)

echo.
echo [3/5] Logging into Railway...
echo Please complete authentication in your browser...
call railway login

echo.
echo [4/5] Deploying to Railway...
call railway up

echo.
echo [5/5] Getting deployment URL...
call railway status

echo.
echo ========================================
echo  Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Visit Railway dashboard to get your live URL
echo.
echo 2. Generate APK:
echo    - Open: https://www.pwabuilder.com
echo    - Enter your Railway URL
echo    - Download APK
echo.
echo 3. Setup Database (Optional):
echo    - Go to supabase.com
echo    - Create project
echo    - Add credentials to Railway
echo.
echo ========================================
echo.
pause
