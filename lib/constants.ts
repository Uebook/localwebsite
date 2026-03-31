// Constants file - same data as mobile app
export const COLORS = {
  // Brand
  orange: '#E86A2C',
  blue: '#4A6CF7',

  // Gradients
  primaryGradient: ['#E86A2C', '#4A6CF7'],
  homeBackground: ['#7A3B1D', '#2B1A14'],

  // Backgrounds
  white: '#FFFFFF',
  darkBg: '#0B1324',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#9CA3AF',
  textLight: '#CBD5E1',

  // Borders
  divider: '#E5E7EB',

  // Highlights
  highlightBg: '#FFF4EC',
};

// Legacy categories - kept for backward compatibility
export const CATEGORIES = [
  { id: '1', name: 'Groceries', iconName: 'ShoppingBag' },
  { id: '2', name: 'Electronics', iconName: 'Smartphone' },
  { id: '3', name: 'Clothing', iconName: 'Shirt' },
  { id: '4', name: 'Medicines', iconName: 'Pill' },
  { id: '5', name: 'Appliances', iconName: 'Zap' },
  { id: '6', name: 'Home', iconName: 'Home' },
  { id: '7', name: 'Accessories', iconName: 'Headphones' },
  { id: '8', name: 'Sports', iconName: 'Trophy' },
];

// Import full category system
export * from './categories';

export const INITIAL_VENDOR_DATA = {
  id: 'v1',
  name: 'My Awesome Shop',
  ownerName: 'John Doe',
  category: 'Grocery',
  rating: 4.8,
  reviewCount: 12,
  distance: '0 km',
  imageUrl: 'https://images.unsplash.com/photo-1604719312566-b7cb9f9fc72e?auto=format&fit=crop&w=800&q=80',
  isVerified: true,
  contactNumber: '9876543210',
  alternateMobile: '9988776655',
  whatsappNumber: '9876543210',
  email: 'john@example.com',
  referralCode: 'REF2024',
  address: 'Shop 12, Main Market',
  landmark: 'Near Clock Tower',
  city: 'New Delhi',
  district: 'Central Delhi',
  pincode: '110001',
  circle: 'Connaught Place',
  geoLocation: { lat: 28.6139, lng: 77.2090 },
  yearsInBusiness: '2',
  openTime: '09:00 AM - 09:00 PM',
  openingTime: '09:00',
  closingTime: '21:00',
  weeklyOff: 'Sunday',
  username: '9876543210',
  otpVerified: true,
  kycStatus: 'Pending',
  activationStatus: 'Active',
  secondaryCategories: ['General Store', 'Daily Essentials'],
  customCategories: ['Imported Snacks'],
  priceUpdateFrequency: 'Weekly',
  stockUpdateOption: 'In Stock',
  enableBulkUpload: false,
  enablePriceNotifications: true,
  competitorRadius: '1km',
  allowedCategories: ['Grocery', 'Essentials'],
  about: 'Welcome to our shop! We provide high quality products.',
  products: [
    { 
      id: 'vp1', 
      name: 'Sample Product', 
      price: '₹100', 
      mrp: '₹120',
      category: 'Snacks',
      stockQty: '50',
      imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=400&q=80', 
      description: 'This is a sample product description.',
      uom: 'Pack',
      brand: 'GoodBrands',
      isFastMoving: true,
      inStock: true
    }
  ],
  enquiries: [
    { id: 'e1', senderName: 'Rahul Kumar', senderMobile: '+91 9898989898', message: 'Hi, do you have this item in stock?', date: '2024-05-20', status: 'new' },
    { id: 'e2', senderName: 'Priya Singh', senderMobile: '+91 9797979797', message: 'What are your shop timings?', date: '2024-05-19', status: 'read' },
    { id: 'e3', senderName: 'Amit Sharma', senderMobile: '+91 9696969696', message: 'Can you deliver to Sector 18?', date: '2024-05-18', status: 'replied' }
  ],
  reviews: [
    { id: 'r1', userName: 'Vikas Gupta', rating: 5, date: '2 days ago', comment: 'Great service and friendly behavior!', reply: 'Thank you Vikas!' },
    { id: 'r2', userName: 'Anjali Mehra', rating: 4, date: '1 week ago', comment: 'Good products but slight delay in delivery.' },
    { id: 'r3', userName: 'Rohan Das', rating: 5, date: '2 weeks ago', comment: 'Best shop in the market. Highly recommended.' }
  ],
  offers: [
    { id: 'vo1', title: 'Grand Opening Sale', description: 'Flat 20% off on first purchase', code: 'WELCOME20', discountAmount: '20%', validUntil: '2025-12-31', isActive: true, color: 'bg-purple-600' }
  ]
};

// Import all other constants from a separate file to keep this manageable
export * from './data';

