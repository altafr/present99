#!/bin/bash

# Set PATH to include common binary locations
export PATH="/usr/local/bin:/usr/local/sbin:/opt/homebrew/bin:$PATH"

# Git Push Helper for Cascade
# This script pushes your code to GitHub with proper PATH configuration

echo "🚀 Git Push to GitHub"
echo "===================="
echo ""

# Check if git is accessible
if ! command -v git &> /dev/null; then
    echo "❌ Git not found even with extended PATH"
    echo "PATH: $PATH"
    exit 1
fi

echo "✅ Git found at: $(which git)"
echo ""

# Check if remote is configured
REMOTE_URL=$(git remote get-url origin 2>/dev/null)

if [ -z "$REMOTE_URL" ]; then
    echo "❌ No remote repository configured"
    echo ""
    echo "Please set up your GitHub repository first:"
    echo "1. Create repo at: https://github.com/new"
    echo "2. Run: git remote add origin https://github.com/altafr/present99.git"
    exit 1
fi

if [[ "$REMOTE_URL" == *"YOUR_USERNAME"* ]]; then
    echo "❌ Remote URL contains placeholder 'YOUR_USERNAME'"
    echo "Current remote: $REMOTE_URL"
    echo ""
    echo "Please update with your actual GitHub username:"
    echo "git remote set-url origin https://github.com/altafr/present99.git"
    exit 1
fi

echo "✅ Remote configured: $REMOTE_URL"
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Uncommitted changes detected:"
    echo ""
    git status -s
    echo ""
    echo "Committing changes..."
    git add .
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "✅ Changes committed"
    echo ""
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Code pushed to GitHub!"
    echo ""
    echo "View your repository: ${REMOTE_URL%.git}"
    echo ""
    echo "Next: Connect to Vercel for auto-deployment"
    echo "https://vercel.com/dashboard"
else
    echo ""
    echo "❌ Push failed"
    echo ""
    echo "Common solutions:"
    echo "1. Create the repository on GitHub first"
    echo "2. Set up authentication (Personal Access Token)"
    echo "3. Check your GitHub username in the remote URL"
fi
