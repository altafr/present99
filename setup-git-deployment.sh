#!/bin/bash

# Set PATH to include common binary locations
export PATH="/usr/local/bin:/usr/local/sbin:/opt/homebrew/bin:$PATH"

# Setup Git Deployment for Present99
# This script helps you connect your project to GitHub and enable auto-deployment

echo "🚀 Present99 - Git Deployment Setup"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Initializing now..."
    git init
    git add .
    git commit -m "Initial commit - Present99 AI Presentation Creator"
    echo "✅ Git initialized and files committed"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create a GitHub repository:"
echo "   Go to: https://github.com/new"
echo "   Name: present99"
echo "   ❌ DO NOT initialize with README"
echo ""
echo "2. After creating the repo, run these commands:"
echo ""
echo "   # Replace YOUR_USERNAME with your GitHub username"
echo "   git remote add origin https://github.com/altafr/present99.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Connect Vercel to GitHub:"
echo "   Go to: https://vercel.com/dashboard"
echo "   Select your project → Settings → Git"
echo "   Click 'Connect Git Repository'"
echo "   Select your GitHub repo"
echo ""
echo "4. Test auto-deployment:"
echo "   Make any change, commit, and push:"
echo "   git add ."
echo "   git commit -m 'Test deployment'"
echo "   git push origin main"
echo ""
echo "✨ After setup, every push will automatically deploy to Vercel!"
echo ""
echo "📖 Full guide: See GIT_DEPLOYMENT_SETUP.md"
