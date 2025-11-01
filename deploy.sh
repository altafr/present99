#!/bin/bash

# Present99 Deployment Script for Vercel

echo "🚀 Present99 Deployment to Vercel"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "${BLUE}Step 1: Deploying Backend (API)${NC}"
echo "=================================="
cd server

echo "📦 Installing dependencies..."
npm install

echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "${GREEN}✅ Backend deployed!${NC}"
echo ""
echo "${YELLOW}⚠️  IMPORTANT: Copy the backend URL from above${NC}"
echo "${YELLOW}   Example: https://present99-api-xxxxx.vercel.app${NC}"
echo ""
read -p "Enter your backend URL (without /api): " BACKEND_URL

# Update frontend .env
cd ../client
echo "VITE_API_URL=${BACKEND_URL}/api" > .env

echo ""
echo "${BLUE}Step 2: Deploying Frontend${NC}"
echo "=================================="

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building..."
npm run build

echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "${GREEN}✅ Frontend deployed!${NC}"
echo ""
echo "=================================="
echo "${GREEN}🎉 Deployment Complete!${NC}"
echo "=================================="
echo ""
echo "Your app is now live!"
echo ""
echo "📝 Next steps:"
echo "1. Test your deployment"
echo "2. Set environment variables in Vercel dashboard:"
echo "   - OPENROUTER_API_KEY"
echo "   - REPLICATE_API_TOKEN"
echo "3. Update CORS in backend if needed"
echo ""
echo "See DEPLOYMENT_GUIDE.md for detailed instructions"
