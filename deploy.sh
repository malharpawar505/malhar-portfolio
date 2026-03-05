#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   Malhar Pawar Portfolio — Vercel Deployment     ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --silent

# Build check
echo ""
echo "🔨 Running build check..."
npx next build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Fix errors above and re-run."
    exit 1
fi
echo "✅ Build successful!"

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo ""
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy
echo ""
echo "🚀 Deploying to Vercel..."
echo "   (If this is your first time, you'll be asked to login)"
echo ""
vercel --prod

echo ""
echo "═══════════════════════════════════════════════════"
echo "✅ Deployment complete! Your portfolio is live."
echo "═══════════════════════════════════════════════════"
echo ""
