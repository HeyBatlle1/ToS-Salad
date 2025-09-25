# ToS Salad Database Extraction for GCP Migration

## 🔒 CRITICAL ISOLATION CONFIRMED

This extraction contains **ONLY** ToS Salad database content. **Safety Companion production data is completely isolated and untouched.**

## 📊 ToS Salad Tables Identified

| Table Name | Purpose | Records | Status |
|------------|---------|---------|---------|
| `tos_analysis_companies` | Core company information | Variable | ✅ Isolated |
| `tos_analysis_documents` | Scraped ToS documents | Variable | ✅ Isolated |
| `tos_analysis_results` | AI analysis results | Variable | ✅ Isolated |
| `bookmarks` | User bookmarks (auth feature) | Variable | ✅ Isolated |

## 📁 Generated Files

### 1. Schema Export
- **File**: `tos-salad-schema-export.sql`
- **Contains**: Complete table structures, indexes, RLS policies
- **Usage**: Create empty database structure on GCP

### 2. Data Export Script
- **File**: `tos-salad-data-export.sh` (executable)
- **Purpose**: Export data from Supabase with complete isolation
- **Safety**: Only targets ToS Salad tables

### 3. GCP Migration Helper
- **File**: `gcp-migration-helper.sh` (executable)
- **Purpose**: End-to-end migration automation
- **Features**: Export + Import + Verification

## 🚀 Migration Process

### Quick Migration (Automated)
```bash
# Set environment variables
export GCP_PROJECT_ID="your-project-id"
export GCP_INSTANCE_NAME="your-cloud-sql-instance"

# Run complete migration
./gcp-migration-helper.sh
```

### Manual Migration (Step by Step)

#### Step 1: Export from Supabase
```bash
# Edit connection string in script
./tos-salad-data-export.sh
```

#### Step 2: Create GCP Database
```bash
gcloud sql databases create tos_salad --instance=your-instance
```

#### Step 3: Import to GCP
```bash
psql -h [GCP_IP] -U [USER] -d tos_salad -f tos-salad-export-[timestamp]/tos-salad-complete-export.sql
```

## ✅ Safety Verification

### Tables Included (ToS Salad Only)
- ✅ `tos_analysis_companies`
- ✅ `tos_analysis_documents`
- ✅ `tos_analysis_results`
- ✅ `bookmarks`

### Tables Excluded (Safety Companion)
- ❌ `safety_companion_*` (Not accessed)
- ❌ `production_*` (Not accessed)
- ❌ `main_app_*` (Not accessed)

### Isolation Measures
1. **Explicit Table Names**: Only specified ToS Salad tables
2. **Schema Analysis**: Verified table relationships
3. **Export Commands**: Table-specific pg_dump commands
4. **Verification**: Record count comparisons

## 🔧 Post-Migration Configuration

### Update Frontend Environment
```env
# Replace in frontend/.env.local
DATABASE_URL=postgresql://user:pass@gcp-ip:5432/tos_salad
```

### Verify Migration Success
```sql
-- Check record counts
SELECT 'tos_analysis_companies', COUNT(*) FROM tos_analysis_companies
UNION ALL
SELECT 'tos_analysis_documents', COUNT(*) FROM tos_analysis_documents
UNION ALL
SELECT 'tos_analysis_results', COUNT(*) FROM tos_analysis_results
UNION ALL
SELECT 'bookmarks', COUNT(*) FROM bookmarks;
```

## 🛡️ Security Notes

1. **Complete Isolation**: No Safety Companion data accessed
2. **Authentication**: Supabase Auth remains unchanged
3. **Permissions**: RLS policies preserved in schema
4. **Backup**: Original data remains in Supabase

## 📞 Support

If you encounter any issues:

1. **Verify Isolation**: Check that only ToS Salad tables are referenced
2. **Connection Issues**: Verify GCP Cloud SQL network settings
3. **Permission Errors**: Ensure database user has CREATEDB privileges
4. **Data Integrity**: Compare record counts between source and target

## 🎯 Ready for Migration

All files are prepared and verified. The migration maintains complete isolation from Safety Companion while ensuring ToS Salad data integrity.

**Files Generated:**
- ✅ Schema: `tos-salad-schema-export.sql`
- ✅ Export Script: `tos-salad-data-export.sh`
- ✅ Migration Helper: `gcp-migration-helper.sh`
- ✅ Documentation: `TOS_SALAD_DATABASE_EXTRACTION.md`