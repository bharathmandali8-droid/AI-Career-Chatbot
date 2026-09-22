import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder')) {
    console.warn('⚠️ Supabase credentials not set or contain placeholder values.');
    console.warn('Please update your .env file with valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to apply database migrations.');
    process.exit(0);
  }

  const sqlPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('🔄 Applying migration script to Supabase...');

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (response.ok) {
      console.log('✅ Migration applied successfully!');
    } else {
      const errText = await response.text();
      console.log('ℹ️ REST SQL RPC standard response:', errText);
      console.log('💡 Note: If rpc/exec_sql is not enabled on your Supabase instance, execute supabase/migrations/001_initial_schema.sql via the Supabase Dashboard SQL Editor.');
    }
  } catch (error) {
    console.error('❌ Migration script error:', error.message);
    console.log('💡 You can run supabase/migrations/001_initial_schema.sql directly in your Supabase SQL Editor.');
  }
}

runMigration();
