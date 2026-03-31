const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const headers = {
  'apikey': SUPABASE_SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
};

async function checkVendors() {
  console.log('Fetching all vendors from Supabase...');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/vendors?select=id,name,address`, { headers });
  if (res.ok) {
    const data = await res.json();
    console.log(`Found ${data.length} vendors:`);
    data.forEach(v => console.log(`- ${v.name} (${v.address})`));
  } else {
    console.error('Fetch failed:', res.status, await res.text());
  }
}

checkVendors();
