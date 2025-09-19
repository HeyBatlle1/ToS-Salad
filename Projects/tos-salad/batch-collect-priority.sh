#!/bin/bash

# ToS Salad Batch Collection Script - Priority URLs
# Run from the tos-salad project directory
# Usage: chmod +x batch-collect-priority.sh && ./batch-collect-priority.sh

echo "🥗 ToS Salad - Batch Collection Started"
echo "============================================"

# Tech Giants - Primary ToS
echo "📱 Processing Tech Giants..."
npx ts-node src/cli.ts collect google.com --verbose
npx ts-node src/cli.ts collect youtube.com --verbose
npx ts-node src/cli.ts collect openai.com --verbose
npx ts-node src/cli.ts collect apple.com --verbose

echo "🛒 Processing E-commerce & Marketplaces..."
npx ts-node src/cli.ts collect amazon.com --verbose
npx ts-node src/cli.ts collect linkedin.com --verbose
npx ts-node src/cli.ts collect paypal.com --verbose

echo "🎮 Processing Social & Communication (Discord Priority)..."
npx ts-node src/cli.ts collect discord.com --verbose

echo "📡 Processing Telecom (Verizon Multiple Services)..."
npx ts-node src/cli.ts collect verizon.com --verbose

echo "🎵 Processing Entertainment & Financial..."
npx ts-node src/cli.ts collect spotify.com --verbose
npx ts-node src/cli.ts collect chase.com --verbose

echo "💰 Processing Crypto & Fintech..."
npx ts-node src/cli.ts collect robinhood.com --verbose
npx ts-node src/cli.ts collect coinbase.com --verbose

echo "💼 Processing Productivity Tools..."
npx ts-node src/cli.ts collect slack.com --verbose
npx ts-node src/cli.ts collect notion.so --verbose
npx ts-node src/cli.ts collect varomoney.com --verbose

echo "🏢 Processing Tech Infrastructure..."
npx ts-node src/cli.ts collect samsung.com --verbose
npx ts-node src/cli.ts collect microsoft.com --verbose
npx ts-node src/cli.ts collect github.com --verbose
npx ts-node src/cli.ts collect supabase.com --verbose

echo "✅ Batch collection completed!"
echo "📊 Run 'npx ts-node src/cli.ts export --format markdown' to see results"