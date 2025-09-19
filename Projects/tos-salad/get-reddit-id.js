const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(
  'https://fbjjqwfcmzrpmytieajp.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

async function getRedditId() {
  const { data } = await supabase
    .from('tos_analysis_companies')
    .select('id')
    .eq('domain', 'reddit.com')
    .single();

  console.log(data?.id);
}

getRedditId();