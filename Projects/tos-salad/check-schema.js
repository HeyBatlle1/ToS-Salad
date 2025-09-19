#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function checkSchema() {
  console.log('🔍 Checking tos_analysis_companies table schema...');

  try {
    // Get one existing record to see the column structure
    const { data, error } = await supabase
      .from('tos_analysis_companies')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Schema check failed:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('📊 ACTUAL COLUMN STRUCTURE:');
      console.log('========================');

      const columns = Object.keys(data[0]);
      columns.forEach((column, index) => {
        const value = data[0][column];
        const type = typeof value;
        console.log(`${index + 1}. ${column}: ${type} ${value !== null ? `(example: ${value})` : '(null)'}`);
      });

      console.log(`\n📈 Total columns: ${columns.length}`);
      console.log(`📄 Total records in table: checking...`);

      // Get total count
      const { count } = await supabase
        .from('tos_analysis_companies')
        .select('*', { count: 'exact', head: true });

      console.log(`📄 Total records: ${count}`);

    } else {
      console.log('⚠️ No data found in table');
    }

  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
  }
}

checkSchema();