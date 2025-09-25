#!/bin/bash
# =====================================
# ToS Salad Data Export Script
# CRITICAL: ONLY exports ToS Salad tables
# ISOLATION: NO Safety Companion data
# =====================================

# Configuration
SUPABASE_DB_URL="postgresql://postgres:[PASSWORD]@db.fbjjqwfcmzrpmytieajp.supabase.co:5432/postgres"
EXPORT_DIR="tos-salad-export-$(date +%Y%m%d-%H%M%S)"
TIMESTAMP=$(date +%Y-%m-%d_%H:%M:%S)

echo "🔒 ToS Salad Database Export - ISOLATED"
echo "📅 Started: $TIMESTAMP"
echo "📁 Export Directory: $EXPORT_DIR"

# Create export directory
mkdir -p "$EXPORT_DIR"

echo ""
echo "🎯 EXPORTING ONLY TOS SALAD TABLES (SAFETY ISOLATION CONFIRMED)"

# 1. Export Companies Table
echo "📊 Exporting tos_analysis_companies..."
pg_dump "$SUPABASE_DB_URL" \
  --data-only \
  --table=tos_analysis_companies \
  --file="$EXPORT_DIR/01-companies-data.sql"

# 2. Export Documents Table
echo "📄 Exporting tos_analysis_documents..."
pg_dump "$SUPABASE_DB_URL" \
  --data-only \
  --table=tos_analysis_documents \
  --file="$EXPORT_DIR/02-documents-data.sql"

# 3. Export Analysis Results Table
echo "🤖 Exporting tos_analysis_results..."
pg_dump "$SUPABASE_DB_URL" \
  --data-only \
  --table=tos_analysis_results \
  --file="$EXPORT_DIR/03-analysis-data.sql"

# 4. Export Bookmarks Table
echo "🔖 Exporting bookmarks..."
pg_dump "$SUPABASE_DB_URL" \
  --data-only \
  --table=bookmarks \
  --file="$EXPORT_DIR/04-bookmarks-data.sql"

# 5. Create combined export
echo "📦 Creating combined export..."
cat > "$EXPORT_DIR/tos-salad-complete-export.sql" << EOF
-- =====================================
-- ToS Salad Complete Database Export
-- Generated: $TIMESTAMP
-- ISOLATION: Only ToS Salad tables
-- =====================================

-- Disable triggers during import
SET session_replication_role = replica;

-- Import data in correct order (respecting foreign keys)
EOF

# Append schema first
cat ../tos-salad-schema-export.sql >> "$EXPORT_DIR/tos-salad-complete-export.sql"

# Append data in dependency order
echo "\\echo 'Loading companies...'" >> "$EXPORT_DIR/tos-salad-complete-export.sql"
cat "$EXPORT_DIR/01-companies-data.sql" >> "$EXPORT_DIR/tos-salad-complete-export.sql"

echo "\\echo 'Loading documents...'" >> "$EXPORT_DIR/tos-salad-complete-export.sql"
cat "$EXPORT_DIR/02-documents-data.sql" >> "$EXPORT_DIR/tos-salad-complete-export.sql"

echo "\\echo 'Loading analysis results...'" >> "$EXPORT_DIR/tos-salad-complete-export.sql"
cat "$EXPORT_DIR/03-analysis-data.sql" >> "$EXPORT_DIR/tos-salad-complete-export.sql"

echo "\\echo 'Loading bookmarks...'" >> "$EXPORT_DIR/tos-salad-complete-export.sql"
cat "$EXPORT_DIR/04-bookmarks-data.sql" >> "$EXPORT_DIR/tos-salad-complete-export.sql"

# Re-enable triggers
echo "SET session_replication_role = DEFAULT;" >> "$EXPORT_DIR/tos-salad-complete-export.sql"

# Generate record counts
echo ""
echo "📈 Generating record counts..."
psql "$SUPABASE_DB_URL" -c "
SELECT
  'tos_analysis_companies' as table_name,
  COUNT(*) as record_count
FROM tos_analysis_companies
UNION ALL
SELECT
  'tos_analysis_documents',
  COUNT(*)
FROM tos_analysis_documents
UNION ALL
SELECT
  'tos_analysis_results',
  COUNT(*)
FROM tos_analysis_results
UNION ALL
SELECT
  'bookmarks',
  COUNT(*)
FROM bookmarks;" > "$EXPORT_DIR/record-counts.txt"

echo ""
echo "✅ Export completed successfully!"
echo "📁 Files created in: $EXPORT_DIR/"
echo "🔒 ISOLATION CONFIRMED: Only ToS Salad data exported"
echo ""
echo "📋 Next Steps:"
echo "1. Review record-counts.txt for data verification"
echo "2. Use tos-salad-complete-export.sql for GCP import"
echo "3. Test import on GCP Cloud SQL"

# Create GCP import instructions
cat > "$EXPORT_DIR/GCP-IMPORT-INSTRUCTIONS.md" << 'EOF'
# ToS Salad GCP Migration Instructions

## Pre-Migration Checklist
- [ ] GCP Cloud SQL PostgreSQL instance created
- [ ] Database user with CREATEDB privileges configured
- [ ] Network connectivity verified
- [ ] Backup of source database taken

## Import Commands

### 1. Connect to GCP Cloud SQL
```bash
gcloud sql connect [INSTANCE_NAME] --user=postgres --database=postgres
```

### 2. Create ToS Salad Database
```sql
CREATE DATABASE tos_salad;
\c tos_salad;
```

### 3. Import Complete Schema + Data
```bash
psql -h [GCP_HOST] -U [USER] -d tos_salad -f tos-salad-complete-export.sql
```

### 4. Verify Import
```sql
-- Check record counts match source
SELECT 'tos_analysis_companies', COUNT(*) FROM tos_analysis_companies
UNION ALL
SELECT 'tos_analysis_documents', COUNT(*) FROM tos_analysis_documents
UNION ALL
SELECT 'tos_analysis_results', COUNT(*) FROM tos_analysis_results
UNION ALL
SELECT 'bookmarks', COUNT(*) FROM bookmarks;

-- Test basic queries
SELECT name, domain FROM tos_analysis_companies LIMIT 5;
SELECT transparency_score FROM tos_analysis_results LIMIT 5;
```

### 5. Update Application Config
Update frontend `.env.local` with new GCP connection string:
```
DATABASE_URL=postgresql://[USER]:[PASS]@[GCP_HOST]:5432/tos_salad
```

## Security Notes
- This export contains ONLY ToS Salad data
- Safety Companion tables are NOT included
- User authentication handled by Supabase Auth (separate)
- Review RLS policies after import
EOF