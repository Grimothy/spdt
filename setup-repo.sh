#!/bin/bash

# Docker Hub Setup Script for SPDT
# Run this after creating your GitHub repo

echo "🚀 SPDT Docker Hub Setup"
echo "========================"

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo "📝 Creating GitHub repository 'spdt'..."
    gh repo create spdt --public --source=. --remote=origin --push

    if [ $? -eq 0 ]; then
        echo "✅ Repository created and code pushed!"
    else
        echo "❌ Failed to create repository. Please create it manually at https://github.com/new"
        echo "   Then run: git remote add origin https://github.com/YOUR_USERNAME/spdt.git"
        echo "   Then run: git push -u origin main"
    fi
else
    echo "❌ GitHub CLI not found. Please:"
    echo "   1. Go to https://github.com/new"
    echo "   2. Create a new repository named 'spdt'"
    echo "   3. Don't initialize with README, .gitignore, or license"
    echo "   4. Run: git remote add origin https://github.com/YOUR_USERNAME/spdt.git"
    echo "   5. Run: git push -u origin main"
fi

echo ""
echo "🔑 GitHub Secrets Setup:"
echo "========================"
echo "Go to your repo settings → Secrets and variables → Actions"
echo "Add these secrets:"
echo ""
echo "DOCKERHUB_USERNAME    Your Docker Hub username"
echo "DOCKERHUB_TOKEN       Your Docker Hub access token (not password!)"
echo ""
echo "To create a Docker Hub token:"
echo "1. Go to https://hub.docker.com/settings/security"
echo "2. Create a new access token"
echo "3. Copy the token value"
echo ""
echo "🎉 Once secrets are set, pushes to main will automatically build and push to Docker Hub!"