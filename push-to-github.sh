#!/bin/bash

# Set PATH to include common binary locations
export PATH="/usr/local/bin:/usr/local/sbin:/opt/homebrew/bin:$PATH"

# Push Present99 to GitHub
# Follow these steps to push your code to GitHub

echo "📦 Pushing Present99 to GitHub"
echo "==============================="
echo ""

# Step 1: Check if we have a valid remote
echo "Step 1: Checking Git remote..."
REMOTE_URL=$(git remote get-url origin 2>/dev/null)

if [[ "$REMOTE_URL" == *"YOUR_USERNAME"* ]]; then
    echo "❌ Remote URL not configured properly"
    echo ""
    echo "Please follow these steps:"
    echo ""
    echo "1. Go to GitHub and create a new repository:"
    echo "   https://github.com/new"
    echo ""
    echo "2. Repository settings:"
    echo "   - Name: present99"
    echo "   - Description: AI-powered presentation creator"
    echo "   - Public or Private (your choice)"
    echo "   - ❌ DO NOT initialize with README"
    echo ""
    echo "3. After creating, GitHub will show you commands like:"
    echo "   git remote add origin https://github.com/YOUR_ACTUAL_USERNAME/present99.git"
    echo ""
    echo "4. Run those commands, then run this script again"
    echo ""
    exit 1
fi

echo "✅ Remote configured: $REMOTE_URL"
echo ""

# Step 2: Check for uncommitted changes
echo "Step 2: Checking for uncommitted changes..."
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes"
    echo ""
    git status -s
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " COMMIT_MSG
        git commit -m "$COMMIT_MSG"
        echo "✅ Changes committed"
    else
        echo "⏭️  Skipping commit"
    fi
else
    echo "✅ No uncommitted changes"
fi
echo ""

# Step 3: Push to GitHub
echo "Step 3: Pushing to GitHub..."
echo ""
echo "Running: git push -u origin main"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Code pushed to GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. View your repo: ${REMOTE_URL%.git}"
    echo "2. Connect to Vercel for auto-deployment:"
    echo "   - Go to https://vercel.com/dashboard"
    echo "   - Select 'present99' project"
    echo "   - Settings → Git → Connect Git Repository"
    echo "   - Select your GitHub repo"
    echo ""
    echo "After connecting, every push will auto-deploy! 🚀"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo ""
    echo "1. Authentication required:"
    echo "   - You may need to enter GitHub username/password"
    echo "   - Or set up SSH keys"
    echo "   - Or use a Personal Access Token"
    echo ""
    echo "2. Repository doesn't exist:"
    echo "   - Create it at https://github.com/new"
    echo ""
    echo "3. Permission denied:"
    echo "   - Make sure you own the repository"
    echo "   - Check your GitHub credentials"
    echo ""
fi
