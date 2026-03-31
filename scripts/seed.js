const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
       console.error('Missing Supabase environment variables in .env.local');
       process.exit(1);
}

const headers = {
       'apikey': SUPABASE_SERVICE_ROLE_KEY,
       'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
       'Content-Type': 'application/json',
       'Prefer': 'resolution=merge-duplicates,return=representation'
};

async function seed() {
       console.log('--- Starting Minimal Database Seeding ---');

       // 1. Fetch Categories
       const catGetRes = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=id,name`, { headers });
       const existingCats = await catGetRes.json();
       const catMap = existingCats.reduce((acc, c) => ({ ...acc, [c.name]: c.id }), {});

       // 2. Seed Vendors (Minimal columns)
       console.log('Seeding vendors...');
       const vendorsToSeed = [
              {
                     name: 'Gupta General Store',
                     owner_name: 'Rajesh Gupta',
                     category: 'Grocery',
                     address: 'Shop No. 12, Hall Bazaar',
                     city: 'Amritsar',
                     state: 'Punjab',
                     pincode: '143001',
                     status: 'Active',
                     kyc_status: 'Approved',
                     image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'
              },
              {
                     name: 'Amrit Dairy',
                     owner_name: 'Harprit Singh',
                     category: 'Dairy',
                     address: 'Main Road, Lawrence Road',
                     city: 'Amritsar',
                     state: 'Punjab',
                     pincode: '143001',
                     status: 'Active',
                     kyc_status: 'Approved',
                     image_url: 'https://images.unsplash.com/photo-1528750955925-cdb4788d8b6d?auto=format&fit=crop&q=80&w=800'
              },
              {
                     name: 'Digital World',
                     owner_name: 'Amit Kumar',
                     category: 'Electronics',
                     address: 'Phase 1, Ranjit Avenue',
                     city: 'Amritsar',
                     state: 'Punjab',
                     pincode: '143001',
                     status: 'Active',
                     kyc_status: 'Approved',
                     image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800'
              },
              {
                     name: 'Sharma Sweets',
                     owner_name: 'Sanjeev Sharma',
                     category: 'Bakery',
                     address: 'Chowk, Putligarh',
                     city: 'Amritsar',
                     state: 'Punjab',
                     pincode: '143001',
                     status: 'Active',
                     kyc_status: 'Approved',
                     image_url: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&q=80&w=800'
              }
       ];

       const venRes = await fetch(`${SUPABASE_URL}/rest/v1/vendors`, {
              method: 'POST',
              headers,
              body: JSON.stringify(vendorsToSeed)
       });

       if (!venRes.ok) {
              console.error('Failed to seed vendors:', await venRes.text());
              return;
       }

       const seededVens = await venRes.json();
       const venMap = seededVens.reduce((acc, v) => ({ ...acc, [v.name]: v.id }), {});
       console.log(`Seeded ${seededVens.length} vendors.`);

       // 3. Seed Products
       console.log('Seeding products...');
       const productsToSeed = [
              { name: 'Milk 1L', price: 56, mrp: 60, vendor_id: venMap['Amrit Dairy'], category_id: catMap['Dairy'], uom: 'litre', is_active: true },
              { name: 'Butter 500g', price: 230, mrp: 245, vendor_id: venMap['Amrit Dairy'], category_id: catMap['Dairy'], uom: 'piece', is_active: true },
              { name: 'Cooking Oil 1L', price: 158, mrp: 175, vendor_id: venMap['Gupta General Store'], category_id: catMap['Grocery'], uom: 'litre', is_active: true },
              { name: 'Basmati Rice 5kg', price: 550, mrp: 600, vendor_id: venMap['Gupta General Store'], category_id: catMap['Grocery'], uom: 'kg', is_active: true },
              { name: 'Smartphone Charger', price: 450, mrp: 550, vendor_id: venMap['Digital World'], category_id: catMap['Electronics'], uom: 'piece', is_active: true },
              { name: 'Wireless Earbuds', price: 1200, mrp: 1500, vendor_id: venMap['Digital World'], category_id: catMap['Electronics'], uom: 'piece', is_active: true },
              { name: 'Paneer 200g', price: 80, mrp: 90, vendor_id: venMap['Amrit Dairy'], category_id: catMap['Dairy'], uom: 'piece', is_active: true },
              { name: 'Samosa (Plate)', price: 40, mrp: 50, vendor_id: venMap['Sharma Sweets'], category_id: catMap['Bakery'], uom: 'plate', is_active: true }
       ];

       const prodRes = await fetch(`${SUPABASE_URL}/rest/v1/vendor_products`, {
              method: 'POST',
              headers,
              body: JSON.stringify(productsToSeed)
       });
       if (prodRes.ok) {
              console.log(`Seeded ${productsToSeed.length} products.`);
       } else {
              console.warn('Product seeding warning:', await prodRes.text());
       }

       console.log('--- Seeding Completed Successfully ---');
}

seed().catch(err => {
       console.error('Seeding failed:', err);
       process.exit(1);
});
