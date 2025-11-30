import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load env vars manually since we are in a script
const envConfig = dotenv.parse(fs.readFileSync('.env'));

const url = envConfig.VITE_SUPABASE_URL;
const key = envConfig.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
    process.exit(1);
}

console.log('Connecting to Supabase...');
console.log('URL:', url);
// Don't log the full key for security
console.log('Key:', key.substring(0, 5) + '...');

const supabase = createClient(url, key);

async function testConnection() {
    try {
        // Try to select from expenses (even if empty, it should not error if connection works)
        const { data, error } = await supabase.from('expenses').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Connection failed:', error.message);
            if (error.code === 'PGRST301') {
                console.error('   (Hint: Row Level Security might be blocking access, or table does not exist)');
            }
        } else {
            console.log('✅ Connection successful!');
            console.log('   Accessed "expenses" table.');
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err);
        if (err.cause) console.error('   Cause:', err.cause);
    }

    // Direct fetch test
    console.log('\nTesting direct fetch...');
    try {
        const resp = await fetch(`${url}/rest/v1/expenses?select=count`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });
        console.log('Direct fetch status:', resp.status, resp.statusText);
        if (!resp.ok) {
            const text = await resp.text();
            console.log('Response body:', text);
        }
    } catch (err) {
        console.error('❌ Direct fetch failed:', err);
    }
}

testConnection();
