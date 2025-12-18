#!/bin/bash

# Ascended Academy Stop Script

echo "🛑 Stopping Ascended Academy..."

# Stop and Delete the process
pm2 stop ascended-academy
pm2 delete ascended-academy

# Save the list so it doesn't come back on reboot
pm2 save

echo "✅ App stopped and removed from PM2."
