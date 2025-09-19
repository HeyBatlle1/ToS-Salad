#!/bin/bash

# ToS Salad - Priority Batch Runner
# Quick launcher for the batch collection process

echo "🥗 ToS Salad - Priority Batch Collection"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "src/cli.ts" ]; then
    echo "❌ Error: Run this script from the tos-salad project root directory"
    echo "Current directory: $(pwd)"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Make sure you have configured:"
    echo "  - SUPABASE_URL"
    echo "  - SUPABASE_ANON_KEY"
    echo "  - GOOGLE_GEMINI_API_KEY"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run the batch collection
echo "🚀 Starting batch collection process..."
echo "This will process all priority ToS documents"
echo ""

node batch-priority-tos.js

echo ""
echo "🎯 Batch collection completed!"
echo "📊 To view results: npm run export or npx ts-node src/cli.ts export"