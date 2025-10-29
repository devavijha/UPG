# 🚀 Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Login
3. Click **"New Project"**
4. Fill in:
   - **Project Name**: `upcycling-marketplace`
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
5. Click **"Create new project"** (takes ~2 minutes)

---

## Step 2: Get API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

3. Update `Frontend/.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxx...
```

---

## Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the SQL below
4. Click **"Run"**

### SQL Schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase Auth handles users, but we can extend it)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT,
  condition TEXT,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  quantity INTEGER DEFAULT 1,
  condition TEXT,
  pickup_address TEXT,
  pincode TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Cart items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Products are viewable by everyone" 
  ON public.products FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create products" 
  ON public.products FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own products" 
  ON public.products FOR UPDATE 
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete own products" 
  ON public.products FOR DELETE 
  USING (auth.uid() = seller_id);

-- Donations policies
CREATE POLICY "Users can view own donations" 
  ON public.donations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create donations" 
  ON public.donations FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own donations" 
  ON public.donations FOR UPDATE 
  USING (auth.uid() = user_id);

-- Cart policies
CREATE POLICY "Users can view own cart" 
  ON public.cart_items FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart" 
  ON public.cart_items FOR ALL 
  USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can view own wishlist" 
  ON public.wishlist FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wishlist" 
  ON public.wishlist FOR ALL 
  USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" 
  ON public.orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" 
  ON public.order_items FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_seller_id_idx ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS donations_user_id_idx ON public.donations(user_id);
CREATE INDEX IF NOT EXISTS cart_items_user_id_idx ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## Step 4: Enable Storage (for images)

1. Go to **Storage** in Supabase dashboard
2. Click **"Create a new bucket"**
3. Name it: `product-images`
4. Make it **Public**
5. Click **"Create bucket"**

### Set Storage Policy:

Go to **Storage** → **Policies** → **New Policy**:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow users to delete own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Step 5: Test Connection

1. Update `Frontend/.env` with your Supabase credentials
2. Start the frontend:
```bash
cd Frontend
npm run dev
```

---

## Step 6: Authentication Setup

Supabase provides built-in authentication. To enable:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (enabled by default)
3. Optional: Enable social logins (Google, GitHub, etc.)

---

## 🎉 You're Done!

Your frontend can now work with Supabase instead of the Node.js backend.

### Benefits:
- ✅ No backend server needed
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ File storage included
- ✅ Automatic API generation
- ✅ Free tier (500MB database, 1GB file storage)

### Next Steps:
1. Update your React components to use Supabase client
2. Test user registration/login
3. Test product creation
4. Deploy frontend to Vercel/Netlify

---

## 📚 Helpful Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [React + Supabase Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
