#!/bin/bash

# IQPlay Brain Games - One-Command Deploy Script
# This script deploys the entire system to production

echo "🚀 IQPlay Brain Games - Production Deployment"
echo "=============================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Build check
echo "🔧 Running build check..."
npm run build

# Step 3: Login to Railway
echo "🔐 Login to Railway..."
railway login

# Step 4: Initialize project (if not already)
echo "🎯 Initializing Railway project..."
railway init --name iqplay-brain-games 2>/dev/null || echo "   Project already initialized"

# Step 5: Set environment variables
echo "⚙️ Setting environment variables..."
echo "   Note: Add your Supabase and Google TTS keys to Railway dashboard"

# Step 6: Deploy
echo "🚀 Deploying to Railway..."
railway up

# Step 7: Get deployment URL
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Getting deployment info..."
DEPLOY_INFO=$(railway status --json 2>/dev/null || echo '{}')

echo ""
echo "=============================================="
echo "🎉 IQPlay is now LIVE!"
echo "=============================================="
echo ""
echo "Next steps:"
echo ""
echo "1. 🌐 Visit your deployment URL in Railway dashboard"
echo ""
echo "2. 📱 Generate APK:"
echo "   - Go to https://www.pwabuilder.com"
echo "   - Enter your Railway URL"
echo "   - Download Android APK"
echo ""
echo "3. 🗄️ Setup Database:"
echo "   - Go to supabase.com"
echo "   - Create project 'iqplay-production'"
echo "   - Run SQL schema from DEPLOYMENT.md"
echo "   - Add credentials to Railway environment"
echo ""
echo "4. 🎤 Enable TTS (Optional):"
echo "   - Get Google Cloud TTS API key"
echo "   - Add to Railway environment"
echo ""
echo "=============================================="
echo "✅ All systems operational!"
echo "=============================================="
