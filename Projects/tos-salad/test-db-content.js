const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function checkContent() {
  const { data, error } = await supabase
    .from('tos_analysis_documents')
    .select('title, raw_content')
    .eq('title', 'Chase Bank Terms of Use - Textbook Corporate Predation')
    .single();
  
  console.log('Chase content length:', data?.raw_content?.length || 0);
  console.log('First 500 chars:', data?.raw_content?.substring(0, 500) || 'No content');
}

checkContent();
