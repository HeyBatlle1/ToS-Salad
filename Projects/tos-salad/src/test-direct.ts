import { supabase } from './database/supabase';

async function testDirectTableAccess() {
  console.log('🔌 Testing direct table access...');
  
  // Try companies table directly
  try {
    const { data, error, count } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Companies table error:', error);
    } else {
      console.log(`✅ Companies table accessible (${count || 0} rows)`);
    }
  } catch (err) {
    console.error('❌ Companies table failed:', err);
  }

  // Try tos_documents table
  try {
    const { data, error, count } = await supabase
      .from('tos_documents')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ TOS documents table error:', error);
    } else {
      console.log(`✅ TOS documents table accessible (${count || 0} rows)`);
    }
  } catch (err) {
    console.error('❌ TOS documents table failed:', err);
  }

  // Try analysis_results table
  try {
    const { data, error, count } = await supabase
      .from('analysis_results')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Analysis results table error:', error);
    } else {
      console.log(`✅ Analysis results table accessible (${count || 0} rows)`);
    }
  } catch (err) {
    console.error('❌ Analysis results table failed:', err);
  }
}

testDirectTableAccess();