import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim().replace(/['"]/g, '');
  }
});

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

async function check() {
  const response = await fetch(`${envVars.VITE_SUPABASE_URL}/rest/v1/`, {
    headers: {
      apikey: envVars.VITE_SUPABASE_ANON_KEY
    }
  });
  const data = await response.json();
  console.log(Object.keys(data.definitions));
}
check();
