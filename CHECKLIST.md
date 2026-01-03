# 📋 Production Checklist

## Pre-Deployment

- [x] Backend code complete
- [x] Frontend UI complete  
- [x] Game engine functional
- [x] AI system operational
- [x] TTS integration ready
- [x] Audio system configured
- [x] PWA manifest created
- [x] Service worker implemented
- [x] Icons generated
- [x] Dockerfile configured
- [ ] Environment variables set

## Deployment Steps

### 1. Setup Accounts

- [ ] Create Railway account (railway.app)
- [ ] Create Supabase account (supabase.com)
- [ ] (Optional) Google Cloud account for TTS

### 2. Database Setup

- [ ] Create Supabase project
- [ ] Run SQL schema
- [ ] Copy Supabase URL and keys
- [ ] Add to Railway environment

### 3. Deploy Backend

- [ ] Install Railway CLI: `npm install -g @railway/cli`
- [ ] Run `railway login`
- [ ] Run `railway init`
- [ ] Run `railway up`
- [ ] Verify deployment URL

### 4. Configure Environment

- [ ] Add SUPABASE_URL to Railway
- [ ] Add SUPABASE_ANON_KEY to Railway
- [ ] Add GOOGLE_CLOUD_TTS_API_KEY (optional)
- [ ] Verify PORT=3000

### 5. Test Deployment

- [ ] Visit deployment URL
- [ ] Test game loading
- [ ] Test AI game generation
- [ ] Test TTS playback (if configured)
- [ ] Test audio system
- [ ] Test on mobile browser

## APK Generation

### 6. PWA Setup

- [ ] Verify manifest.json is accessible
- [ ] Verify service worker is registered
- [ ] Test offline mode
- [ ] Verify icons load correctly

### 7. Generate APK (Choose One Method)

#### Method A: PWABuilder (Recommended)

- [ ] Go to <https://www.pwabuilder.com>
- [ ] Enter deployment URL
- [ ] Click "Package for Stores"
- [ ] Download Android APK
- [ ] Test on Android device

#### Method B: Capacitor

- [ ] Install: `npm install @capacitor/core @capacitor/cli @capacitor/android`
- [ ] Init: `npx cap init "IQPlay" "com.iqplay.braingames"`
- [ ] Add Android: `npx cap add android`
- [ ] Copy assets: `npx cap copy`
- [ ] Open Android Studio: `npx cap open android`
- [ ] Build signed APK
- [ ] Test on device

#### Method C: AppGeyser (Fastest)

- [ ] Go to <https://appgeyser.com>
- [ ] Create app from website
- [ ] Enter deployment URL
- [ ] Customize name and icon
- [ ] Download APK
- [ ] Test on device

## Testing

### 8. Web App Testing

- [ ] Test on Chrome mobile
- [ ] Test on Safari iOS
- [ ] Test on Firefox
- [ ] Test offline functionality
- [ ] Test all 6 game categories
- [ ] Test AI game generation
- [ ] Test leaderboard (if configured)
- [ ] Test profile/stats

### 9. APK Testing

- [ ] Install APK on test device
- [ ] Test app icon and name
- [ ] Test splash screen
- [ ] Test all games
- [ ] Test audio playback
- [ ] Test TTS (if configured)
- [ ] Test offline mode
- [ ] Test performance

## Google Play Submission (Optional)

### 10. Prepare Assets

- [ ] Create 512x512 app icon
- [ ] Create feature graphic (1024x500)
- [ ] Take screenshots (phone + tablet)
- [ ] Write app description
- [ ] Create privacy policy
- [ ] Prepare promotional materials

### 11. Google Play Console

- [ ] Create developer account ($25 one-time)
- [ ] Create new app listing
- [ ] Upload APK/AAB
- [ ] Fill app details
- [ ] Add screenshots
- [ ] Set content rating
- [ ] Set pricing (free)
- [ ] Submit for review

### 12. Post-Submission

- [ ] Monitor review status
- [ ] Respond to review feedback
- [ ] Test production listing
- [ ] Setup analytics
- [ ] Monitor crash reports

## Maintenance

### 13. Monitoring

- [ ] Setup error tracking
- [ ] Monitor Railway logs
- [ ] Check Supabase usage
- [ ] Monitor API quotas
- [ ] Track user feedback

### 14. Updates

- [ ] Plan update schedule
- [ ] Test updates locally
- [ ] Deploy to Railway
- [ ] Update APK version
- [ ] Resubmit to Play Store (if published)

## Production Status

**Current Phase:** Ready for Deployment

**Completed:**

- ✅ Full backend system
- ✅ Premium frontend UI
- ✅ 50 brain games
- ✅ AI game generator
- ✅ Bosnian TTS integration
- ✅ Audio engine
- ✅ PWA configuration
- ✅ Docker setup
- ✅ Deployment guides

**Pending:**

- ⏳ Railway deployment
- ⏳ Supabase setup
- ⏳ APK generation
- ⏳ Device testing

## Quick Commands

### Deploy Now

```bash
# Windows
deploy.bat

# Linux/Mac
./deploy.sh
```

### Generate APK

```bash
# Windows
generate-apk.bat

# Or visit
https://www.pwabuilder.com
```

### Test Locally

```bash
npm install
npm start
# Visit http://localhost:3000
```

---

**Ready to Deploy?**

Start with: `deploy.bat` (Windows) or `./deploy.sh` (Linux/Mac)

Then visit PWABuilder to generate APK!
