@echo off
REM IQPlay - Quick APK Generation

echo ========================================
echo  IQPlay - APK Generator
echo ========================================
echo.

REM Auto-detect deployment URL from Vercel
set DEPLOY_URL=

REM Check for .vercel folder
if exist .vercel\project.json (
    echo Detecting Vercel deployment...
    REM Read deployment URL (you'll need to add this after first deploy)
    set DEPLOY_URL=https://iqplay-brain-games.vercel.app
) else (
    echo No deployment detected yet.
    echo.
    echo Please deploy first using: deploy-vercel.bat
    echo.
)

echo ========================================
echo  RECOMMENDED: PWABuilder Method
echo ========================================
echo.
echo This is the FASTEST and EASIEST way!
echo - Takes only 5 minutes
echo - Free and high quality
echo - No coding required
echo.

if defined DEPLOY_URL (
    echo Your deployment URL: %DEPLOY_URL%
    echo.
    echo Opening PWABuilder automatically...
    timeout /t 2 >nul
    start https://www.pwabuilder.com/?site=%DEPLOY_URL%
) else (
    echo After deploying, enter your URL at PWABuilder
    echo.
    echo Opening PWABuilder...
    timeout /t 2 >nul
    start https://www.pwabuilder.com
)

echo.
echo ========================================
echo  STEPS IN PWABUILDER:
echo ========================================
echo.
echo 1. Enter your deployment URL (if not auto-filled)
echo 2. Click "Start"
echo 3. Wait for analysis
echo 4. Click "Package for Stores"
echo 5. Select "Android"
echo 6. Download APK
echo.
echo ========================================
echo.
echo Want other methods? Choose below:
echo.
echo [1] Continue with PWABuilder (RECOMMENDED - Already opened)
echo [2] Capacitor (Native build)
echo [3] AppGeyser (Instant with ads)
echo [4] Show all options
echo [5] Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto pwabuilder
if "%choice%"=="2" goto capacitor
if "%choice%"=="3" goto appgeyser
if "%choice%"=="4" goto showall

:pwabuilder
echo.
echo === PWABuilder Method ===
echo.
echo Step 1: Deploy your app first
echo   Run: deploy.bat
echo.
echo Step 2: Get your deployment URL from Railway
echo.
echo Step 3: Visit https://www.pwabuilder.com
echo.
echo Step 4: Enter your URL and click "Package for Stores"
echo.
echo Step 5: Download Android APK
echo.
echo Opening PWABuilder...
start https://www.pwabuilder.com
echo.
goto end

:capacitor
echo.
echo === Capacitor Method ===
echo.
echo Installing Capacitor...
call npm install @capacitor/core @capacitor/cli @capacitor/android

echo.
echo Initializing Capacitor...
call npx cap init "IQPlay" "com.iqplay.braingames"

echo.
echo Adding Android platform...
call npx cap add android

echo.
echo Copying web assets...
call npx cap copy

echo.
echo Opening Android Studio...
call npx cap open android

echo.
echo In Android Studio:
echo 1. Wait for Gradle sync to complete
echo 2. Go to Build > Generate Signed Bundle / APK
echo 3. Select APK
echo 4. Create keystore (if first time)
echo 5. Build Release APK
echo 6. APK will be in: android/app/build/outputs/apk/release/
echo.
goto end

:appgeyser
echo.
echo === AppGeyser Method ===
echo.
echo Step 1: Deploy your app first (run deploy.bat)
echo.
echo Step 2: Visit https://appgeyser.com
echo.
echo Step 3: Click "Create App" > "Website"
echo.
echo Step 4: Enter your deployed URL
echo.
echo Step 5: Customize app name and icon
echo.
echo Step 6: Download APK immediately!
echo.
echo Note: Free version shows ads. Upgrade to remove.
echo.
echo Opening AppGeyser...
start https://appgeyser.com
echo.
goto end

:showall
echo.
echo === All APK Generation Options ===
echo.
echo ONLINE BUILDERS (No coding):
echo ---------------------------------
echo 1. PWABuilder     - https://www.pwabuilder.com (Free, high quality)
echo 2. AppGeyser      - https://appgeyser.com (Free with ads)
echo 3. VoltBuilder    - https://voltbuilder.com ($50/year, professional)
echo 4. Bubble.io      - https://bubble.io (Build + Deploy)
echo.
echo CODE-BASED (Requires dev tools):
echo ---------------------------------
echo 5. Capacitor      - Native wrapper (Run option 2)
echo 6. React Native   - Full native app (Advanced)
echo 7. Cordova        - Classic hybrid approach
echo.
echo RECOMMENDED FOR YOU:
echo ---------------------------------
echo PWABuilder is the best choice!
echo - Free
echo - Fast (5 minutes)
echo - High quality
echo - No coding required
echo.
echo Would you like to open PWABuilder now? (y/n)
set /p open="Enter choice: "
if /i "%open%"=="y" start https://www.pwabuilder.com
echo.
goto end

:end
echo.
echo ========================================
echo  For more help, see APK_BUILD_GUIDE.md
echo ========================================
echo.
pause
