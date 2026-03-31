// All data constants from mobile app
export const NEARBY_BUSINESSES = [
  {
    id: '101',
    name: 'Joe\'s Pizza & Grill',
    category: 'Restaurant',
    rating: 4.5,
    reviewCount: 128,
    distance: '0.8 km',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    address: 'Block A, Connaught Place',
    openTime: 'Opens at 11:00 AM',
    about: 'Authentic Italian pizza and grill in the heart of the city.',
    products: [
      { id: 'p1', name: 'Margherita Pizza', price: '₹350', mrp: '₹400', category: 'Pizza', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80', description: 'Classic cheese and basil' },
      { id: 'p2', name: 'Pasta Alfredo', price: '₹400', category: 'Pasta', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&q=80', description: 'Creamy white sauce pasta' },
      { id: 'p3', name: 'Grilled Sandwich', price: '₹150', category: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80' }
    ],
    offers: [
      { id: 'o101', title: 'Pizza Fest', description: 'Buy 1 Get 1 Free on Large Pizzas', code: 'BOGOPIZZA', discountAmount: 'BOGO', validUntil: '2024-11-30', isActive: true, color: 'bg-orange-500' }
    ]
  },
  {
    id: '102',
    name: 'City Care Pharmacy',
    category: 'Healthcare',
    rating: 4.8,
    reviewCount: 45,
    distance: '1.2 km',
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80',
    address: 'Sector 15, Noida',
    openTime: 'Open 24 Hours',
    about: 'Your trusted neighborhood pharmacy for all medical needs.',
    offers: []
  },
  {
    id: '103',
    name: 'QuickFix Auto',
    category: 'Car Service',
    rating: 4.2,
    reviewCount: 89,
    distance: '2.5 km',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=800&q=80',
    address: 'Okhla Industrial Area',
    openTime: 'Opens at 9:00 AM',
    offers: [
      { id: 'o103', title: 'Service Week', description: '10% off on full service', code: 'CARLOVE', discountAmount: '10%', validUntil: '2024-10-15', isActive: true, color: 'bg-blue-600' }
    ]
  },
  {
    id: '104',
    name: 'Elite Salon',
    category: 'Beauty',
    rating: 4.7,
    reviewCount: 210,
    distance: '3.0 km',
    imageUrl: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
    address: 'Greater Kailash 1',
    openTime: 'Opens at 10:00 AM',
    offers: []
  },
];

export const FEATURED_BUSINESSES = [
  {
    id: '201',
    name: 'Grand Plaza Hotel',
    category: 'Hotel',
    rating: 4.9,
    reviewCount: 1500,
    distance: '5.0 km',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    isPromoted: true,
    address: 'Aerocity, New Delhi',
    about: 'Luxury stay with world-class amenities.',
    products: [
      { id: 'fp1', name: 'Deluxe Room', price: '₹5000/night', imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80' },
      { id: 'fp2', name: 'Spa Session', price: '₹2000', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80' }
    ],
    offers: []
  },
  {
    id: '202',
    name: 'Tech World Repairs',
    category: 'Electronics',
    rating: 4.6,
    reviewCount: 340,
    distance: '1.5 km',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
    isPromoted: true,
    address: 'Nehru Place',
    about: 'Expert repairs for all your electronic gadgets.',
    offers: []
  },
];

export const RECENT_SEARCHES = [
  'Plumber',
  'Restaurants',
  'AC Repair',
  'Hotels',
  'Electrician',
  'Car Wash',
];

export const PROMO_BANNERS = [
  {
    id: 'b1',
    title: 'Summer Sale!',
    subtitle: 'Get 50% off on AC Services',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Book Now',
  },
  {
    id: 'b2',
    title: 'New in Town?',
    subtitle: 'Explore top-rated local cafes',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Explore',
  },
  {
    id: 'b3',
    title: 'Health Checkup Camp',
    subtitle: 'Free basic checkups this weekend',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'View Details',
  },
];

export const HOME_SERVICES = [
  { id: 'hs1', name: 'Cleaning', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
  { id: 'hs2', name: 'Plumber', imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=400&q=80' },
  { id: 'hs3', name: 'Electrician', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80' },
  { id: 'hs4', name: 'Painting', imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80' },
  { id: 'hs5', name: 'Carpenter', imageUrl: 'https://images.unsplash.com/photo-1622295023576-e413e7073364?auto=format&fit=crop&w=400&q=80' },
];

export const EDUCATION_SERVICES = [
  { id: 'ed1', name: 'Tutors', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80' },
  { id: 'ed2', name: 'Music Class', imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80' },
  { id: 'ed3', name: 'Dance', imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=400&q=80' },
  { id: 'ed4', name: 'Coaching', imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80' },
  { id: 'ed5', name: 'Art School', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80' },
];

export const DAILY_ESSENTIALS = [
  { id: 'de1', name: 'Grocery', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80' },
  { id: 'de2', name: 'Vegetables', imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=400&q=80' },
  { id: 'de3', name: 'Milk', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80' },
  { id: 'de4', name: 'Medicines', imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=400&q=80' },
  { id: 'de5', name: 'Meat', imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80' },
];

export const HEALTH_FITNESS = [
  { id: 'hf1', name: 'Gym', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80' },
  { id: 'hf2', name: 'Yoga', imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=400&q=80' },
  { id: 'hf3', name: 'Doctors', imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80' },
  { id: 'hf4', name: 'Labs', imageUrl: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&w=400&q=80' },
  { id: 'hf5', name: 'Dietician', imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80' },
];

export const BEAUTY_SPA = [
  { id: 'bs1', name: 'Salon', imageUrl: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=400&q=80' },
  { id: 'bs2', name: 'Massage', imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=400&q=80' },
  { id: 'bs3', name: 'Makeup', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80' },
  { id: 'bs4', name: 'Nails', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80' },
  { id: 'bs5', name: 'Skincare', imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=400&q=80' },
];

// SEARCH_RESULTS with complete vendor details
export const SEARCH_RESULTS = [
  // Grocery Vendors with Complete Details
  {
    id: 'g1',
    name: 'Daily Fresh Market',
    category: 'Groceries',
    rating: 4.5,
    reviewCount: 120,
    distance: '0.5 km',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    address: 'Shop No. 15, Sector 18 Market',
    landmark: 'Near Metro Station',
    city: 'Noida',
    district: 'Gautam Buddha Nagar',
    pincode: '201301',
    circle: 'Sector 18',
    geoLocation: { lat: 28.5700, lng: 77.3200 },
    contactNumber: '9876543210',
    alternateMobile: '9876543211',
    whatsappNumber: '9876543210',
    email: 'dailyfresh@example.com',
    yearsInBusiness: '5 Years',
    openTime: 'Open Now',
    openingTime: '07:00',
    closingTime: '22:00',
    weeklyOff: 'Sunday',
    about: 'Daily Fresh Market is your one-stop shop for all grocery needs. We offer fresh vegetables, fruits, dairy products, and daily essentials at competitive prices. With over 5 years of experience, we ensure quality products and excellent customer service.',
    products: [
      {
        id: 'g1p1',
        name: 'Basmati Rice (1kg)',
        price: '₹120',
        mrp: '₹140',
        category: 'Grains',
        stockQty: '150',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
        description: 'Premium quality long grain basmati rice, perfect for biryani and pulao.',
        uom: 'Kg',
        brand: 'India Gate',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g1p2',
        name: 'Toor Dal (1kg)',
        price: '₹95',
        mrp: '₹110',
        category: 'Pulses',
        stockQty: '200',
        imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc11e664f?auto=format&fit=crop&w=400&q=80',
        description: 'Fresh toor dal, rich in protein and essential nutrients.',
        uom: 'Kg',
        brand: 'Local',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g1p3',
        name: 'Sunflower Oil (1L)',
        price: '₹145',
        mrp: '₹165',
        category: 'Cooking Oil',
        stockQty: '80',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
        description: 'Refined sunflower oil, cholesterol-free and heart-healthy.',
        uom: 'Litre',
        brand: 'Fortune',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g1p4',
        name: 'Tomato (1kg)',
        price: '₹40',
        mrp: '₹50',
        category: 'Vegetables',
        stockQty: '100',
        imageUrl: 'https://images.unsplash.com/photo-1546095667-0c4e01a98039?auto=format&fit=crop&w=400&q=80',
        description: 'Fresh, red, and juicy tomatoes, locally sourced.',
        uom: 'Kg',
        brand: 'Local',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g1p5',
        name: 'Onion (1kg)',
        price: '₹35',
        mrp: '₹45',
        category: 'Vegetables',
        stockQty: '120',
        imageUrl: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=400&q=80',
        description: 'Fresh onions, perfect for daily cooking needs.',
        uom: 'Kg',
        brand: 'Local',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g1p6',
        name: 'Milk (1L)',
        price: '₹60',
        mrp: '₹65',
        category: 'Dairy',
        stockQty: '50',
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
        description: 'Fresh, pure cow milk, delivered daily.',
        uom: 'Litre',
        brand: 'Amul',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g1p7',
        name: 'Bread (400g)',
        price: '₹35',
        mrp: '₹40',
        category: 'Bakery',
        stockQty: '60',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
        description: 'Fresh white bread, soft and delicious.',
        uom: 'Pack',
        brand: 'Britannia',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g1p8',
        name: 'Sugar (1kg)',
        price: '₹45',
        mrp: '₹50',
        category: 'Sweeteners',
        stockQty: '90',
        imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
        description: 'Pure white sugar, fine quality.',
        uom: 'Kg',
        brand: 'Madhur',
        isFastMoving: true,
        inStock: true
      }
    ],
    reviews: [
      {
        id: 'g1r1',
        userName: 'Rahul Sharma',
        rating: 5,
        date: '2 days ago',
        comment: 'Excellent quality products and very friendly staff. Prices are reasonable too!',
        reply: 'Thank you Rahul! We appreciate your feedback.'
      },
      {
        id: 'g1r2',
        userName: 'Priya Mehta',
        rating: 4,
        date: '1 week ago',
        comment: 'Good variety of products. Fresh vegetables and fruits. Will definitely shop again.',
        reply: null
      },
      {
        id: 'g1r3',
        userName: 'Amit Kumar',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Best grocery store in the area. Always fresh products and good service.',
        reply: 'Thank you for your kind words, Amit!'
      },
      {
        id: 'g1r4',
        userName: 'Sneha Patel',
        rating: 4,
        date: '3 weeks ago',
        comment: 'Convenient location and good prices. Staff is helpful.',
        reply: null
      }
    ],
    offers: [
      {
        id: 'g1o1',
        title: 'Weekend Special',
        description: 'Get 10% off on all vegetables and fruits',
        code: 'VEG10',
        discountAmount: '10%',
        validUntil: '2025-12-31',
        isActive: true,
        color: 'bg-green-600'
      },
      {
        id: 'g1o2',
        title: 'First Order Discount',
        description: 'Flat ₹50 off on orders above ₹500',
        code: 'FIRST50',
        discountAmount: '₹50',
        validUntil: '2025-12-31',
        isActive: true,
        color: 'bg-orange-500'
      }
    ],
    enquiries: [
      {
        id: 'g1e1',
        senderName: 'Vikram Singh',
        senderMobile: '+91 9898989898',
        message: 'Do you have organic vegetables available?',
        date: '2024-12-20',
        status: 'new'
      },
      {
        id: 'g1e2',
        senderName: 'Anita Desai',
        senderMobile: '9797979797',
        message: 'What are your delivery charges?',
        date: '2024-12-19',
        status: 'read'
      }
    ]
  },
  {
    id: 'g2',
    name: 'Organic Harvest',
    category: 'Groceries',
    rating: 4.8,
    reviewCount: 85,
    distance: '1.2 km',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    address: 'Shop No. 42, Greater Kailash Part 1',
    landmark: 'Near M Block Market',
    city: 'New Delhi',
    district: 'South Delhi',
    pincode: '110048',
    circle: 'Greater Kailash',
    geoLocation: { lat: 28.5500, lng: 77.2400 },
    contactNumber: '9876543220',
    alternateMobile: '9876543221',
    whatsappNumber: '9876543220',
    email: 'organicharvest@example.com',
    yearsInBusiness: '8 Years',
    openTime: 'Open Now',
    openingTime: '06:00',
    closingTime: '21:00',
    weeklyOff: 'Monday',
    about: 'Organic Harvest specializes in organic and natural products. We source directly from farmers to ensure the freshest organic produce. Our store offers a wide range of organic groceries, fruits, vegetables, grains, and health products. We are committed to promoting healthy living through organic food.',
    products: [
      {
        id: 'g2p1',
        name: 'Organic Brown Rice (1kg)',
        price: '₹180',
        mrp: '₹200',
        category: 'Grains',
        stockQty: '80',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
        description: 'Certified organic brown rice, rich in fiber and nutrients.',
        uom: 'Kg',
        brand: 'Organic India',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g2p2',
        name: 'Organic Moong Dal (500g)',
        price: '₹85',
        mrp: '₹95',
        category: 'Pulses',
        stockQty: '100',
        imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc11e664f?auto=format&fit=crop&w=400&q=80',
        description: 'Organic moong dal, pesticide-free and nutritious.',
        uom: 'Pack',
        brand: 'Organic India',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g2p3',
        name: 'Cold Pressed Coconut Oil (500ml)',
        price: '₹350',
        mrp: '₹400',
        category: 'Cooking Oil',
        stockQty: '40',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
        description: 'Pure cold-pressed coconut oil, unrefined and natural.',
        uom: 'Bottle',
        brand: 'Organic Harvest',
        isFastMoving: false,
        inStock: true
      },
      {
        id: 'g2p4',
        name: 'Organic Tomatoes (500g)',
        price: '₹60',
        mrp: '₹70',
        category: 'Vegetables',
        stockQty: '70',
        imageUrl: 'https://images.unsplash.com/photo-1546095667-0c4e01a98039?auto=format&fit=crop&w=400&q=80',
        description: 'Fresh organic tomatoes, grown without pesticides.',
        uom: 'Pack',
        brand: 'Local Organic',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g2p5',
        name: 'Organic Spinach (250g)',
        price: '₹45',
        mrp: '₹55',
        category: 'Vegetables',
        stockQty: '50',
        imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80',
        description: 'Fresh organic spinach, rich in iron and vitamins.',
        uom: 'Bunch',
        brand: 'Local Organic',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g2p6',
        name: 'Organic Milk (500ml)',
        price: '₹80',
        mrp: '₹90',
        category: 'Dairy',
        stockQty: '60',
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
        description: 'Pure organic cow milk, hormone-free and fresh.',
        uom: 'Pack',
        brand: 'Organic Valley',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g2p7',
        name: 'Organic Honey (500g)',
        price: '₹450',
        mrp: '₹500',
        category: 'Sweeteners',
        stockQty: '30',
        imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=400&q=80',
        description: 'Pure organic honey, raw and unprocessed.',
        uom: 'Jar',
        brand: 'Organic Harvest',
        isFastMoving: false,
        inStock: true
      },
      {
        id: 'g2p8',
        name: 'Organic Quinoa (500g)',
        price: '₹320',
        mrp: '₹350',
        category: 'Grains',
        stockQty: '25',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
        description: 'Premium organic quinoa, high in protein and gluten-free.',
        uom: 'Pack',
        brand: 'Organic India',
        isFastMoving: false,
        inStock: true
      },
      {
        id: 'g2p9',
        name: 'Organic Turmeric Powder (200g)',
        price: '₹180',
        mrp: '₹200',
        category: 'Spices',
        stockQty: '45',
        imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
        description: 'Pure organic turmeric powder, natural and chemical-free.',
        uom: 'Pack',
        brand: 'Organic Harvest',
        isFastMoving: true,
        inStock: true
      },
      {
        id: 'g2p10',
        name: 'Organic Green Tea (100g)',
        price: '₹250',
        mrp: '₹280',
        category: 'Beverages',
        stockQty: '35',
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
        description: 'Premium organic green tea, rich in antioxidants.',
        uom: 'Pack',
        brand: 'Organic India',
        isFastMoving: false,
        inStock: true
      }
    ],
    reviews: [
      {
        id: 'g2r1',
        userName: 'Meera Joshi',
        rating: 5,
        date: '3 days ago',
        comment: 'Best organic store in the area! Quality products and knowledgeable staff. Highly recommended for health-conscious shoppers.',
        reply: 'Thank you Meera! We are glad you love our products.'
      },
      {
        id: 'g2r2',
        userName: 'Rajesh Verma',
        rating: 5,
        date: '1 week ago',
        comment: 'Amazing organic produce. Fresh, authentic, and worth every rupee. The vegetables are so fresh!',
        reply: 'Thank you for your trust in Organic Harvest!'
      },
      {
        id: 'g2r3',
        userName: 'Kavita Nair',
        rating: 4,
        date: '2 weeks ago',
        comment: 'Good variety of organic products. Prices are a bit high but quality is excellent.',
        reply: null
      },
      {
        id: 'g2r4',
        userName: 'Suresh Reddy',
        rating: 5,
        date: '3 weeks ago',
        comment: 'My go-to store for all organic needs. Staff is very helpful and products are always fresh.',
        reply: 'We appreciate your continued support, Suresh!'
      },
      {
        id: 'g2r5',
        userName: 'Divya Menon',
        rating: 4,
        date: '1 month ago',
        comment: 'Great selection of organic products. Love the fresh vegetables and organic dairy products.',
        reply: null
      }
    ],
    offers: [
      {
        id: 'g2o1',
        title: 'Organic Week',
        description: '15% off on all organic vegetables and fruits',
        code: 'ORG15',
        discountAmount: '15%',
        validUntil: '2025-12-31',
        isActive: true,
        color: 'bg-green-600'
      },
      {
        id: 'g2o2',
        title: 'Health Package',
        description: 'Buy 3 organic products, get 1 free (lowest value)',
        code: 'HEALTH3',
        discountAmount: 'Free Item',
        validUntil: '2025-12-31',
        isActive: true,
        color: 'bg-purple-600'
      }
    ],
    enquiries: [
      {
        id: 'g2e1',
        senderName: 'Neha Kapoor',
        senderMobile: '+91 9688888888',
        message: 'Do you have organic quinoa in stock?',
        date: '2024-12-20',
        status: 'replied'
      },
      {
        id: 'g2e2',
        senderName: 'Arjun Malhotra',
        senderMobile: '9677777777',
        message: 'What are your store timings on weekends?',
        date: '2024-12-19',
        status: 'read'
      }
    ]
  },
  // Other categories
  { id: 'e1', name: 'Tech World', category: 'Electronics', rating: 4.6, reviewCount: 340, distance: '1.5 km', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80', isVerified: true, address: 'Nehru Place' },
  { id: 'c1', name: 'Fashion Hub', category: 'Clothing', rating: 4.5, reviewCount: 250, distance: '1.0 km', imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80', isVerified: true, address: 'Sarojini Nagar' },
];
// Consolidated list for search
export const ALL_SEARCH_RESULTS = [
  ...SEARCH_RESULTS,
  ...NEARBY_BUSINESSES,
  ...FEATURED_BUSINESSES,
].reduce((acc: any[], curr: any) => {
  if (!acc.find(item => item.id === curr.id)) {
    acc.push(curr);
  }
  return acc;
}, []);
