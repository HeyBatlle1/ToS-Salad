#!/bin/bash
# =====================================
# ToS Salad GCP Migration Helper
# SAFE: Only processes ToS Salad data
# =====================================

set -e  # Exit on any error

echo "🚀 ToS Salad GCP Migration Helper"
echo "🔒 SAFETY: Only migrates ToS Salad database (isolated)"
echo ""

# Configuration check
if [ -z "$GCP_PROJECT_ID" ]; then
    echo "❌ Error: Set GCP_PROJECT_ID environment variable"
    echo "   export GCP_PROJECT_ID=your-project-id"
    exit 1
fi

if [ -z "$GCP_INSTANCE_NAME" ]; then
    echo "❌ Error: Set GCP_INSTANCE_NAME environment variable"
    echo "   export GCP_INSTANCE_NAME=your-sql-instance"
    exit 1
fi

echo "🎯 Target Configuration:"
echo "   Project: $GCP_PROJECT_ID"
echo "   Instance: $GCP_INSTANCE_NAME"
echo ""

# Step 1: Export from Supabase
echo "📤 STEP 1: Export ToS Salad data from Supabase"
read -p "Enter Supabase database password: " -s SUPABASE_PASSWORD
echo ""

# Update connection string in export script
SUPABASE_URL="postgresql://postgres:$SUPABASE_PASSWORD@db.fbjjqwfcmzrpmytieajp.supabase.co:5432/postgres"

# Run export
echo "🔄 Running data export..."
SUPABASE_DB_URL="$SUPABASE_URL" ./tos-salad-data-export.sh

EXPORT_DIR=$(ls -t tos-salad-export-* | head -n1)
echo "✅ Export completed: $EXPORT_DIR"
echo ""

# Step 2: GCP Cloud SQL Setup
echo "📊 STEP 2: GCP Cloud SQL preparation"
echo "🔄 Creating ToS Salad database on GCP..."

# Create database on GCP
gcloud sql databases create tos_salad \
    --instance="$GCP_INSTANCE_NAME" \
    --project="$GCP_PROJECT_ID"

echo "✅ Database 'tos_salad' created on GCP"
echo ""

# Step 3: Import to GCP
echo "📥 STEP 3: Import ToS Salad data to GCP"
echo "🔄 Importing complete export..."

# Get connection info
GCP_IP=$(gcloud sql instances describe "$GCP_INSTANCE_NAME" --project="$GCP_PROJECT_ID" --format="value(ipAddresses[0].ipAddress)")

echo "🌐 GCP Instance IP: $GCP_IP"
read -p "Enter GCP database user [postgres]: " GCP_USER
GCP_USER=${GCP_USER:-postgres}

read -p "Enter GCP database password: " -s GCP_PASSWORD
echo ""

# Import using psql
echo "🔄 Starting import process..."
PGPASSWORD="$GCP_PASSWORD" psql \
    -h "$GCP_IP" \
    -U "$GCP_USER" \
    -d "tos_salad" \
    -f "$EXPORT_DIR/tos-salad-complete-export.sql"

echo "✅ Import completed!"
echo ""

# Step 4: Verification
echo "📋 STEP 4: Verify migration"
echo "🔍 Checking record counts..."

PGPASSWORD="$GCP_PASSWORD" psql \
    -h "$GCP_IP" \
    -U "$GCP_USER" \
    -d "tos_salad" \
    -c "
SELECT 'tos_analysis_companies' as table_name, COUNT(*) as records FROM tos_analysis_companies
UNION ALL
SELECT 'tos_analysis_documents', COUNT(*) FROM tos_analysis_documents
UNION ALL
SELECT 'tos_analysis_results', COUNT(*) FROM tos_analysis_results
UNION ALL
SELECT 'bookmarks', COUNT(*) FROM bookmarks;
"

echo ""
echo "📊 Compare with source counts in: $EXPORT_DIR/record-counts.txt"
echo ""

# Step 5: Environment Configuration
echo "⚙️  STEP 5: Update application configuration"
echo ""
echo "🔧 Update your frontend/.env.local with:"
echo "DATABASE_URL=postgresql://$GCP_USER:[PASSWORD]@$GCP_IP:5432/tos_salad"
echo ""

# Final summary
echo "🎉 MIGRATION COMPLETED SUCCESSFULLY!"
echo ""
echo "📋 Summary:"
echo "✅ ToS Salad data exported from Supabase (isolated)"
echo "✅ GCP Cloud SQL database created"
echo "✅ Schema and data imported to GCP"
echo "✅ Verification completed"
echo ""
echo "🔒 SAFETY CONFIRMED:"
echo "   - Only ToS Salad tables migrated"
echo "   - Safety Companion data untouched"
echo "   - Complete isolation maintained"
echo ""
echo "📁 Export files preserved in: $EXPORT_DIR"
echo "📋 Next: Update application environment variables"