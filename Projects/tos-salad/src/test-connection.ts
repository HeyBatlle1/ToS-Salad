import { NotionDatabase } from './database/notion';

async function testConnection() {
  const db = new NotionDatabase();
  const success = await db.testConnection();
  
  if (success) {
    console.log('Testing data retrieval...');
    const analysis = await db.getCompanyAnalysis('Microsoft Corporation');
    console.log('Microsoft analysis:', analysis);
  }
}

testConnection().catch(console.error);
