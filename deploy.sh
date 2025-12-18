#!/bin/bash

# Ascended Academy Deployment Script

echo "🚀 Starting Deployment for Ascended Academy..."

# 1. Install Dependencies
echo "📦 Installing/Updating Dependencies..."
npm install

# 2. Start or Reload with PM2
# We use 'ascended-academy' as the process name defined in ecosystem.config.js
if pm2 show ascended-academy > /dev/null; then
    echo "🔄 App is running. Reloading..."
    pm2 reload ecosystem.config.js --update-env
else
    echo "▶️ App not running. Starting..."
    pm2 start ecosystem.config.js
fi

# 3. Save PM2 list so it restarts on reboot
echo "💾 Saving PM2 process list..."
pm2 save

echo "✅ Deployment Complete! App running on port 5005."
