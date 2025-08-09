const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://nqmfytuxboiwdumnovlz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xbWZ5dHV4Ym9pd2R1bW5vdmx6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDYyMzYxNiwiZXhwIjoyMDcwMTk5NjE2fQ.KnIQppoZKoUAGu8eiKjvmB--ejqWyUX_PJNeuJrYfS8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, '../supabase/migrations/001_legacy_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Running legacy app migration...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      console.error('Migration error:', error);
      // Try direct approach
      console.log('Trying direct SQL execution...');
      
      // Split the SQL into individual statements
      const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log('Executing:', statement.trim().substring(0, 50) + '...');
          const { error: stmtError } = await supabase.rpc('exec_sql', {
            sql: statement.trim() + ';'
          });
          if (stmtError) {
            console.error('Statement error:', stmtError);
          }
        }
      }
    } else {
      console.log('Migration completed successfully!');
    }
    
  } catch (error) {
    console.error('Error running migration:', error);
  }
}

runMigration();
