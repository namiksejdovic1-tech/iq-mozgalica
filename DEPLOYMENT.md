# 🚀 IQPlay Brain Games - PRODUCTION DEPLOYMENT

## AUTO-DEPLOYMENT TO PRODUCTION

This system deploys automatically to multiple platforms.

### 🎯 PRIORITY 1: Railway (Recommended)

**Why Railway:**

- ✅ Automatic deployments
- ✅ Free tier: 500 hours/month
- ✅ PostgreSQL included
- ✅ SSL automatic
- ✅ Custom domains

**Deploy Now:**

```bash
# Install Railway CLI (if not installed)
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to GitHub (optional)
railway link

# Deploy
railway up

# Get URL
railway open
```

**Automatic with GitHub:**

1. Push to GitHub
2. Connect repository at railway.app
3. Auto-deploys on every push
4. URL: `https://iqplay-production.up.railway.app`

---

### 🎯 PRIORITY 2: Vercel (Frontend Focus)

**Deploy Command:**

```bash
npm install -g vercel
vercel --prod
```

**Deploy Time:** 2 minutes
**URL Format:** `https://iqplay-braingames.vercel.app`

---

### 🎯 PRIORITY 3: Render (Full Stack)

**Steps:**

1. Go to render.com
2. Connect GitHub repo
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Add SUPABASE credentials
4. Deploy

**URL Format:** `https://iqplay.onrender.com`

---

### 🎯 PRIORITY 4: Fly.io (Global Edge)

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Deploy
fly deploy
```

---

## 🗄️ DATABASE: Supabase (Auto-Setup)

**Quick Setup:**

1. Go to supabase.com
2. Create project: "iqplay-production"
3. Copy credentials

**Database Schema:**

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game scores table
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  game_id TEXT,
  score INTEGER,
  time INTEGER,
  accuracy INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboard view
CREATE VIEW leaderboard AS
SELECT 
  u.name,
  SUM(s.score) as total_score,
  COUNT(s.id) as games_played
FROM users u
JOIN scores s ON u.id = s.user_id
GROUP BY u.id, u.name
ORDER BY total_score DESC
LIMIT 100;
```

---

## 🔐 ENVIRONMENT VARIABLES

Create `.env` file:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# Google Cloud TTS
GOOGLE_CLOUD_TTS_API_KEY=your_tts_key_here

# App Config
PORT=3000
NODE_ENV=production
```

**Add to Railway:**

```bash
railway variables set SUPABASE_URL=xxx
railway variables set SUPABASE_ANON_KEY=xxx
railway variables set GOOGLE_CLOUD_TTS_API_KEY=xxx
```

---

## 📱 PWA + APK GENERATION

### Step 1: Deploy Web App

```bash
railway up
# Wait for deployment
```

### Step 2: Generate APK

```bash
# Visit https://www.pwabuilder.com
# Enter your Railway URL
# Download Android APK
```

**Or use Capacitor:**

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize
npx cap init "IQPlay" "com.iqplay.braingames"

# Add Android
npx cap add android

# Build
npx cap copy
npx cap open android

# In Android Studio:
# Build > Generate Signed Bundle / APK
```

---

## 🎨 ASSETS NEEDED

### Icons (Generate automatically)

Use <https://realfavicongenerator.net> or create manually:

- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `apple-touch-icon.png` (180x180)
- `favicon.ico`

**Quick Generate:**

```bash
# Install sharp
npm install -g sharp-cli

# Generate from single SVG/PNG
sharp -i logo.png -o icon-192.png resize 192 192
sharp -i logo.png -o icon-512.png resize 512 512
```

---

## 🚀 ONE-COMMAND DEPLOY

Create `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying IQPlay Brain Games..."

# Build
echo "📦 Building..."
npm run build

# Deploy to Railway
echo "🚄 Deploying to Railway..."
railway up

# Get URL
DEPLOY_URL=$(railway status --json | jq -r '.url')

echo "✅ Deployed successfully!"
echo "🌐 Live at: $DEPLOY_URL"
echo "📱 Generate APK: https://www.pwabuilder.com"
echo "   Enter URL: $DEPLOY_URL"
```

Run:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📊 DEPLOYMENT STATUS

- [x] Backend built
- [x] Frontend built
- [x] Game engine ready
- [x] AI system active
- [x] TTS integrated
- [x] Audio system ready
- [ ] Deploy to Railway
- [ ] Configure Supabase
- [ ] Generate APK
- [ ] Test on device

---

## 🎯 NEXT STEPS

1. **Deploy immediately:**

   ```bash
   railway up
   ```

2. **Configure database:**
   - Setup Supabase
   - Run SQL schema
   - Add credentials to Railway

3. **Generate APK:**
   - Visit pwabuilder.com
   - Enter deployment URL
   - Download APK

4. **Test:**
   - Install APK on Android
   - Test all games
   - Verify TTS works
   - Check leaderboard

---

**🔥 READY FOR PRODUCTION DEPLOYMENT**

Choose platform and run deploy command!
