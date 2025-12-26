# Dal Rotti Website 
  
A modern, responsive website for Dal Rotti, an authentic North Indian restaurant in Frankfurt, built with Next.js and React. 

## Features

- **Modern Design**: Clean, responsive UI built with Tailwind CSS 
- **SEO Optimized**: Meta tags, structured data, and semantic HTML for better search engine visibility
- **Multilingual Support**: English and German language options
- **Performance Optimized**: Fast loading times with optimized images and code splitting
- **Mobile-First Approach**: Fully responsive design for all device sizes
- **Accessibility**: WCAG compliant for better user experience
- **Dark Mode Support**: Elegant theme switching with consistent styling

## Tech Stack
 
- **Next.js**: React framework with server-side rendering for better SEO
- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form validation and handling
- **React Icons**: Icon library
- **Framer Motion**: Animation library
- **i18next**: Internationalization framework
- **next-themes**: Theme management for dark/light mode

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Backend API running (default: http://localhost:4000)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dal-rotti-website.git
   cd dal-rotti-website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set:
   ```env
   NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Admin Panel Access

### How to Access Admin Panel

1. **Navigate to Admin Login:**
   - **Important:** Type the URL directly in your browser address bar (don't navigate from the main site)
   - Visit: **`http://localhost:3000/admin`**
   - Alternative: **`http://localhost:3000/admin/auth`**
   
   ⚠️ **Note:** The admin panel is NOT under `/en/` or `/de/` routes. It's at the root level. If you're on the main site (e.g., `localhost:3000/en/`), you need to manually change the URL in the address bar to `localhost:3000/admin`.

2. **Login Credentials:**
   - Use your admin username and password provided by the system administrator
   - Default credentials (development only):
     - Username: `admin`
     - Password: Contact your backend administrator

3. **After Login:**
   - You'll be redirected to: `/admin/dashboard`
   - Access all admin features from the dashboard navigation

### Admin Features

The admin panel provides comprehensive restaurant management:

- **📊 Dashboard**: Overview of orders, revenue, and key metrics
- **🛒 Orders**: Kanban board for order management with drag-and-drop status updates
- **🍽️ Menu Management**: Full CRUD operations for dishes and categories
  - Add/Edit/Delete dishes with photo uploads
  - Toggle availability and sold-out status
  - Organize dishes by categories
  - Drag-and-drop reordering
- **🎟️ Coupons**: Create, edit, and delete promotional coupons
- **👥 Customers**: View and manage customer information
- **📈 Reports**: Sales reports, payment types, and analytics
- **⚙️ Settings**: Restaurant configuration and preferences

### Admin Panel URLs

| Feature | URL |
|---------|-----|
| Login | `/admin/auth` |
| Dashboard | `/admin/dashboard` |
| Orders (Kanban) | `/admin/orders` |
| Menu Management | `/admin/menu` |
| Coupons | `/admin/coupons` |
| Customers | `/admin/customers` |
| Reports | `/admin/reports` |

## User Authentication (Customers)

### How Users Can Sign In

Currently, the website is designed as a **restaurant showcase and ordering platform**. Customer authentication is handled through:

1. **Order Placement:**
   - Customers place orders directly through the website
   - Contact information is collected during checkout
   - No account creation required for ordering

2. **Future User Portal (Coming Soon):**
   - Customer accounts for order history
   - Saved addresses and preferences
   - Loyalty program integration
   - URL: `/user/login` (to be implemented)

### For Customers

- **Browse Menu**: Visit `/en/menu` or `/de/menu`
- **Place Orders**: Use the reservation/order form
- **Contact**: Use the contact page or call directly
- **No login required** for browsing or placing orders

## Project Structure

```
dal-rotti-website/
├── public/                      # Static assets (images, icons, menus)
├── src/
│   ├── app/                     # App router pages
│   │   ├── admin/              # Admin panel pages
│   │   │   ├── auth/           # Admin login page
│   │   │   ├── dashboard/      # Admin dashboard
│   │   │   ├── orders/         # Order management (Kanban)
│   │   │   ├── menu/           # Menu management
│   │   │   ├── coupons/        # Coupon management
│   │   │   └── ...             # Other admin features
│   │   ├── en/                 # English pages
│   │   └── de/                 # German pages
│   ├── components/             # Reusable components
│   │   ├── layout/             # Layout components
│   │   ├── menu/               # Menu components
│   │   ├── reservation/        # Reservation components
│   │   └── ui/                 # UI components
│   ├── services/               # API service layers
│   │   ├── adminApi.ts         # Admin authentication
│   │   ├── apiService.ts       # Order management
│   │   ├── dishApi.ts          # Dish CRUD operations
│   │   ├── categoryApi.ts      # Category operations
│   │   └── couponApi.ts        # Coupon operations
│   ├── hooks/                  # Custom React hooks
│   ├── i18n/                   # Internationalization files
│   ├── lib/                    # Utility functions
│   └── assets/                 # Images and icons
├── .env.local                  # Environment variables (not in git)
├── .gitignore
├── next.config.js
├── package.json
├── README.md                   # This file
├── THEME.md                    # Theme system documentation
├── API_QUICK_REFERENCE.md      # API integration guide
├── HIGH_PRIORITY_IMPLEMENTATION.md  # Implementation details
└── tsconfig.json
```

## Theme System

The website uses a comprehensive theme system with support for both light and dark modes. The theme is built on Tailwind CSS with custom CSS variables to ensure consistent colors and styling across the application.

Key features of the theme system:

- **Dual-mode support**: Light and dark themes with seamless transitions
- **Semantic section classes**: `primary-section` and `contrast-section` for visual hierarchy
- **Accessibility-focused**: All color combinations meet WCAG 2.1 AA standards
- **Consistent components**: Buttons, cards, and form elements with theme-aware styling

For detailed information about the theme system, including color palettes, component styling, and best practices, see [THEME.md](./THEME.md).

## API Integration

### Backend API Configuration

The frontend connects to a backend API for admin operations. Configure the backend URL in `.env.local`:

```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000
```

### Available API Services

- **Admin Authentication**: Login, token management
- **Order Management**: Kanban-optimized endpoints for order status updates
- **Dish Management**: CRUD operations with photo uploads
- **Category Management**: Create, update, delete categories
- **Coupon Management**: Create, update, delete promotional coupons

For detailed API documentation, see [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md).

## Deployment

### Frontend Deployment (Vercel)

The website can be deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fdal-rotti-website)

**Before deploying:**

1. Set environment variables in Vercel:
   ```
   NEXT_PUBLIC_BACKEND_API_URL=https://your-production-api.com
   ```

2. Deploy backend API first and get the production URL

3. Update the environment variable with the production API URL

### Backend Deployment

Ensure your backend API is deployed and accessible before deploying the frontend. The backend should:

- Support CORS for your frontend domain
- Have proper authentication endpoints
- Provide all required API endpoints (orders, dishes, categories, coupons)
- Support file uploads for dish photos

## SEO Features

- **Meta Tags**: Dynamic meta titles and descriptions for each page
- **Structured Data**: JSON-LD for restaurant information
- **Semantic HTML**: Proper heading structure and semantic elements
- **Canonical URLs**: Prevent duplicate content issues
- **Hreflang Tags**: Support for multiple languages
- **Open Graph & Twitter Cards**: Rich social media sharing

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries, please contact [info@dalrotti.com](mailto:info@dalrotti.com).
