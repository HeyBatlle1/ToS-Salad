const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nqmfytuxboiwdumnovlz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xbWZ5dHV4Ym9pd2R1bW5vdmx6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDYyMzYxNiwiZXhwIjoyMDcwMTk5NjE2fQ.KnIQppoZKoUAGu8eiKjvmB--ejqWyUX_PJNeuJrYfS8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('Creating legacy app tables...');
  
  try {
    // Create confessions table
    console.log('Creating confessions table...');
    const { error: confessionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS confessions (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id uuid REFERENCES auth.users,
          encrypted_content text,
          created_at timestamptz DEFAULT now()
        );
      `
    });
    
    if (confessionsError) {
      console.error('Error creating confessions table:', confessionsError);
    } else {
      console.log('✓ Confessions table created');
    }

    // Create recipients table
    console.log('Creating recipients table...');
    const { error: recipientsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS recipients (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          confession_id uuid REFERENCES confessions,
          email text,
          decrypt_key text
        );
      `
    });
    
    if (recipientsError) {
      console.error('Error creating recipients table:', recipientsError);
    } else {
      console.log('✓ Recipients table created');
    }

    // Create heartbeats table
    console.log('Creating heartbeats table...');
    const { error: heartbeatsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS heartbeats (
          user_id uuid PRIMARY KEY REFERENCES auth.users,
          last_seen timestamptz,
          trigger_after interval
        );
      `
    });
    
    if (heartbeatsError) {
      console.error('Error creating heartbeats table:', heartbeatsError);
    } else {
      console.log('✓ Heartbeats table created');
    }

    // Enable RLS
    console.log('Enabling RLS...');
    const rlsQueries = [
      'ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE heartbeats ENABLE ROW LEVEL SECURITY;'
    ];

    for (const query of rlsQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error) console.error('RLS error:', error);
    }

    // Create policies
    console.log('Creating RLS policies...');
    const policies = [
      `CREATE POLICY IF NOT EXISTS "Users can manage their own confessions" ON confessions FOR ALL USING (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can manage recipients for their confessions" ON recipients FOR ALL USING (confession_id IN (SELECT id FROM confessions WHERE user_id = auth.uid()));`,
      `CREATE POLICY IF NOT EXISTS "Users can manage their own heartbeat" ON heartbeats FOR ALL USING (auth.uid() = user_id);`
    ];

    for (const policy of policies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) console.error('Policy error:', error);
    }

    console.log('✅ All tables and policies created successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createTables();
