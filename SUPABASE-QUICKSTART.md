# 🚀 Quick Supabase Setup - Step by Step

## ✅ Your Progress:
- [x] Supabase account created
- [x] Project created
- [x] API credentials added to .env
- [ ] Database tables created
- [ ] Storage bucket configured
- [ ] Frontend tested

---

## 📋 Step 1: Run the SQL Schema

### Method 1: Using Supabase Dashboard (Easiest)

1. **Open Supabase Dashboard**:
   - Go to: https://app.supabase.com/project/wssduhfpwwfhplgmtaey/sql/new

2. **Open the SQL file**:
   - Open `supabase-schema.sql` in your project root
   - Copy ALL the content (Cmd+A, Cmd+C)

3. **Run the SQL**:
   - Paste it in the Supabase SQL Editor
   - Click **"Run"** (or Cmd+Enter)
   - Wait for "Success" message

4. **Verify Tables Created**:
   - Go to: https://app.supabase.com/project/wssduhfpwwfhplgmtaey/editor
   - You should see these tables:
     - profiles
     - products
     - donations
     - cart_items
     - wishlist
     - orders
     - order_items

---

## 📦 Step 2: Create Storage Bucket for Images

1. **Go to Storage**:
   - https://app.supabase.com/project/wssduhfpwwfhplgmtaey/storage/buckets

2. **Create New Bucket**:
   - Click **"New bucket"**
   - Name: `product-images`
   - **Public bucket**: Toggle ON ✅
   - Click **"Create bucket"**

3. **Set Storage Policies**:
   - Click on the `product-images` bucket
   - Go to **"Policies"** tab
   - Click **"New Policy"**
   
   **Policy 1: Public Read**
   ```sql
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'product-images');
   ```
   
   **Policy 2: Authenticated Upload**
   ```sql
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'product-images' 
     AND auth.role() = 'authenticated'
   );
   ```
   
   **Policy 3: Users Delete Own**
   ```sql
   CREATE POLICY "Users can delete own images"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'product-images' 
     AND auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

---

## 🧪 Step 3: Test the Connection

Run this command from your project:

```bash
cd Frontend
npm run dev
```

Then open your browser console and test:

```javascript
// In browser console
const { data, error } = await supabase.from('products').select('*')
console.log('Products:', data)
```

---

## ✅ Step 4: Verify Everything Works

### Quick Test Checklist:

1. **Database Tables**: 
   - Visit: https://app.supabase.com/project/wssduhfpwwfhplgmtaey/editor
   - Confirm all 7 tables exist

2. **Storage Bucket**:
   - Visit: https://app.supabase.com/project/wssduhfpwwfhplgmtaey/storage/buckets
   - Confirm `product-images` bucket exists

3. **Authentication**:
   - Visit: https://app.supabase.com/project/wssduhfpwwfhplgmtaey/auth/users
   - Email auth should be enabled (it is by default)

---

## 🎯 What You Get:

✅ **User Authentication**
- Sign up / Sign in
- Password reset
- Email verification (optional)

✅ **Database Tables**
- Users/Profiles
- Products (with CRUD)
- Donations
- Shopping Cart
- Wishlist
- Orders & Order Items

✅ **File Storage**
- Product image uploads
- Public access for viewing
- Secure upload for authenticated users

✅ **Security**
- Row Level Security (RLS) enabled
- Users can only access their own data
- Public read for products
- Private data for carts, orders, etc.

---

## 🔗 Quick Links

- **Your Project Dashboard**: https://app.supabase.com/project/wssduhfpwwfhplgmtaey
- **SQL Editor**: https://app.supabase.com/project/wssduhfpwwfhplgmtaey/sql/new
- **Table Editor**: https://app.supabase.com/project/wssduhfpwwfhplgmtaey/editor
- **Storage**: https://app.supabase.com/project/wssduhfpwwfhplgmtaey/storage/buckets
- **Auth Settings**: https://app.supabase.com/project/wssduhfpwwfhplgmtaey/auth/users

---

## 🆘 Troubleshooting

**Error: "relation 'public.profiles' does not exist"**
- You haven't run the SQL schema yet
- Go to SQL Editor and run `supabase-schema.sql`

**Error: "new row violates row-level security policy"**
- RLS is enabled but policies aren't set
- Re-run the SQL schema (it includes DROP POLICY IF EXISTS)

**Images won't upload**
- Check storage bucket exists and is public
- Verify storage policies are set
- Check browser console for errors

---

## 🎉 Next Steps

Once setup is complete:

1. **Start Frontend**:
   ```bash
   cd Frontend
   npm run dev
   ```

2. **Test Features**:
   - Sign up a new user
   - Create a product
   - Upload an image
   - Add to cart
   - Create an order

3. **Deploy** (optional):
   - Deploy to Vercel/Netlify
   - Your app will work entirely without backend server!

---

**Need help? Check the full guide in SUPABASE-SETUP.md**
