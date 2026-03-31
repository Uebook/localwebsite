# Local Market Website

A Next.js web application that replicates the Local Market mobile app functionality. This website provides all the features of the mobile app in a web-friendly format.

## Features

### Customer Features
- **Home Page**: Browse categories, services, and nearby businesses
- **Search**: Search for businesses, products, and services
- **Categories**: Browse all available categories
- **Saved Items**: View your saved businesses
- **Offers**: View all available offers and deals
- **Vendor Details**: View detailed information about businesses
- **Enquiry System**: Send enquiries to businesses

### Vendor Features
- **Dashboard**: Overview of business performance
- **Analytics**: Performance insights and recommendations
- **Catalog**: Manage products and services
- **Enquiries**: View and respond to customer enquiries
- **Reviews**: View and respond to customer reviews
- **Profile**: Manage business profile and details

### Utility Pages
- **Settings**: Manage account settings
- **Help & Support**: FAQ and support information
- **Notifications**: View all notifications
- **Login**: Customer and vendor login with OTP

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Icons)
- **Next Image** (Optimized images)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
website/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── categories/         # Categories page
│   ├── search/            # Search page
│   ├── saved/             # Saved items page
│   ├── offers/            # Offers page
│   ├── vendor/            # Vendor pages
│   │   ├── [id]/         # Vendor details
│   │   └── dashboard/     # Vendor dashboard
│   ├── login/             # Login page
│   ├── settings/          # Settings page
│   ├── help/              # Help page
│   └── notifications/     # Notifications page
├── components/            # Reusable components
│   ├── Header.tsx        # App header
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── SearchBar.tsx     # Search component
│   ├── CategoryGrid.tsx   # Category grid
│   └── ...
├── lib/                   # Utilities and constants
│   ├── constants.ts      # App constants
│   └── data.ts           # Mock data
└── app/globals.css        # Global styles
```

## Pages Overview

### Main Pages
- `/` - Home page with categories and services
- `/categories` - All categories
- `/search` - Search results
- `/saved` - Saved businesses
- `/offers` - Offers and deals
- `/vendor/[id]` - Vendor/business details

### Vendor Pages
- `/vendor/dashboard` - Vendor dashboard
- `/vendor/dashboard/analytics` - Analytics and insights
- `/vendor/dashboard/catalog` - Product catalog management
- `/vendor/dashboard/enquiries` - Customer enquiries
- `/vendor/dashboard/reviews` - Customer reviews
- `/vendor/dashboard/profile` - Business profile

### Utility Pages
- `/login` - Login page (Customer/Business)
- `/settings` - Settings page
- `/help` - Help and support
- `/notifications` - Notifications

## Styling

The website uses Tailwind CSS for styling, matching the mobile app's design system:
- Primary colors: Orange (#E86A2C) and Blue (#4A6CF7)
- Gradient backgrounds matching mobile app
- Responsive design for all screen sizes

## Data

Currently uses mock data from `lib/data.ts` and `lib/constants.ts`. In production, this would connect to a backend API.

## Deployment

This website can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting platform**

## Notes

- All pages are client-side rendered for interactivity
- Images are optimized using Next.js Image component
- Responsive design works on mobile, tablet, and desktop
- Matches the mobile app's UI/UX as closely as possible
