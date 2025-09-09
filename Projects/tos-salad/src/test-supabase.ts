import { TosSaladDB } from './database/supabase';

async function testSupabaseConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  try {
    const db = new TosSaladDB();
    
    // Test basic connection
    const companies = await db.getCompanies();
    console.log(`✅ Connected to Supabase successfully`);
    console.log(`📊 Found ${companies.length} companies in tos_salad schema`);
    
    if (companies.length > 0) {
      console.log(`📋 Sample company: ${companies[0].name} (${companies[0].domain})`);
    } else {
      console.log(`📝 Database is empty - ready for data collection`);
    }
    
    // Test search functionality
    console.log(`🔍 Testing search capabilities...`);
    const searchResults = await db.searchCompanies('tech');
    console.log(`🎯 Search for 'tech' returned ${searchResults.length} results`);
    
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

testSupabaseConnection();