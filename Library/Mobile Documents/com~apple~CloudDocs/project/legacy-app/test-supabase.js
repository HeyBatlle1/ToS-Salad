const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nqmfytuxboiwdumnovlz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xbWZ5dHV4Ym9pd2R1bW5vdmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MjM2MTYsImV4cCI6MjA3MDE5OTYxNn0.gQSVjUyhf9OywikfT3dp7EOFmGJp-wyxvPYHPkj6sSs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('confessions').select('count').limit(1);
    if (error) {
      console.error('Database connection error:', error);
    } else {
      console.log('✓ Database connection successful');
    }

    // Test auth signup
    console.log('Testing auth signup...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test4@example.com',
      password: 'password123'
    });
    
    if (authError) {
      console.error('Auth signup error:', authError);
    } else {
      console.log('✓ Auth signup successful:', authData);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAuth();
