# 🌱 Upcycling Marketplace

A sustainable e-commerce platform built with React, TypeScript, and Supabase that promotes upcycling and waste reduction through buying, selling, and donating products.

## 🚀 Features

- **Buy & Sell Products**: Browse and purchase upcycled products or list your own items
- **Waste Donation**: Submit waste materials for recycling and upcycling
- **User Authentication**: Secure login and signup with Supabase Auth
- **Shopping Cart & Wishlist**: Save items and manage your cart
- **Order Management**: Place orders and track order history
- **User Dashboard**: Manage your listings, orders, and account
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI components
- **Supabase Client** - Backend integration

### Backend
- **Supabase** - PostgreSQL database, authentication, and storage
- **Row Level Security (RLS)** - Database security policies

## 📋 Prerequisites

- Node.js 20.19+ or 22.12+ (required for Vite)
- npm or yarn
- Supabase account (free tier available)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Upcycling-Marketplace.git
   cd Upcycling-Marketplace
   ```

2. **Install Frontend dependencies**
   ```bash
   cd Frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 🗄️ Database Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema**
   - Go to SQL Editor in your Supabase dashboard
   - Run the following files in order:
     - `supabase-step1-tables.sql` - Creates tables
     - `supabase-step2-policies.sql` - Sets up Row Level Security
     - `supabase-step3-functions.sql` - Creates triggers and functions

3. **Create Storage Bucket**
   - Go to Storage in Supabase dashboard
   - Create a public bucket named `product-images`
   - Set appropriate access policies

## 🚀 Running the Application

### Development Mode
```bash
cd Frontend
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
Upcycling-Marketplace/
├── Frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/           # Utility functions and services
│   │   │   ├── supabase.ts           # Supabase client
│   │   │   ├── supabase-services.ts  # API service layer
│   │   │   └── shop.ts               # Cart/wishlist utilities
│   │   ├── pages/         # Route pages
│   │   └── main.tsx       # App entry point
│   ├── .env               # Environment variables (not in git)
│   └── package.json
├── backend/               # Legacy Node.js backend (optional)
├── supabase-step1-tables.sql      # Database schema
├── supabase-step2-policies.sql    # RLS policies
├── supabase-step3-functions.sql   # Database functions
└── README.md
```

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `VITE_API_URL` | API endpoint (if using backend) | `http://localhost:3000` |

## 📊 Database Schema

The application uses the following main tables:

- **profiles** - User profile information
- **products** - Product listings
- **donations** - Waste donation submissions
- **cart_items** - Shopping cart items
- **wishlist** - User wishlist items
- **orders** - Order records
- **order_items** - Individual items in orders

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Authentication required for user-specific operations
- Secure image uploads to Supabase Storage
- Environment variables for sensitive credentials

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Node.js version must be 20.19+ or 22.12+ (Vite requirement)
- Ensure Supabase tables are in `public` schema for proper access

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with 💚 for a sustainable future**
