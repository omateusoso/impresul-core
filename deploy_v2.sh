#!/bin/bash
echo "📦 Preparing to push V2.0 modules to GitHub..."

# Add all changes
git add .

# Commit with a descriptive message
git commit -m "feat: implement v2.0 modules (Global Stock, Service Orders, Quotes)"

# Push to the current branch
git push

echo "🚀 Successfully pushed updates to GitHub!"
