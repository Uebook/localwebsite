const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const headers = {
       'apikey': SUPABASE_SERVICE_ROLE_KEY,
       'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
       'Content-Type': 'application/json',
       'Prefer': 'return=representation'
};

async function addNoveltyVendor() {
       console.log('Adding Novelty Chowk Vendor (Verified Columns Only)...');

       const vendor = {
              name: 'Novelty Sweets & Restaurant',
              owner_name: 'Kashish Mahajan',
              category: 'Bakery',
              address: 'Novelty Chowk, Lawrence Road',
              city: 'Amritsar',
              state: 'Punjab',
              pincode: 143001,
              status: 'Active',
              kyc_status: 'Approved',
              image_url: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&q=80&w=800'
       };

       const res = await fetch(`${SUPABASE_URL}/rest/v1/vendors`, {
              method: 'POST',
              headers,
              body: JSON.stringify(vendor)
       });

       if (res.ok) {
              const data = await res.json();
              console.log('Added vendor:', data[0].name);

              const catRes = await fetch(`${SUPABASE_URL}/rest/v1/categories?name=eq.Bakery&select=id`, { headers });
              const cats = await catRes.json();
              const bakeryId = cats[0]?.id;

              const products = [
                     { name: 'Novelty Special Barfi', price: 600, mrp: 650, vendor_id: data[0].id, category_id: bakeryId, is_active: true },
                     { name: 'Pure Desi Ghee Jalebi', price: 400, mrp: 450, vendor_id: data[0].id, category_id: bakeryId, is_active: true }
              ];

              const prodRes = await fetch(`${SUPABASE_URL}/rest/v1/vendor_products`, {
                     method: 'POST',
                     headers,
                     body: JSON.stringify(products)
              });
              console.log('Added Novelty products.');
       } else {
              console.error('Failed to add vendor:', await res.text());
       }
}

addNoveltyVendor();
