# Vercel Deployment Guide

## Prerequisites
- GitHub repository with your code
- Vercel account (sign up at https://vercel.com)
- Supabase project with database setup

## Step 1: Configure Environment Variables in Vercel

⚠️ **CRITICAL**: Add these environment variables in Vercel before deploying:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

### Required Environment Variables:

```bash
VITE_SUPABASE_URL=https://lndiysekguawoonqmepv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZGl5c2VrZ3Vhd29vbnFtZXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTMzNjYsImV4cCI6MjA3NzMyOTM2Nn0.y1SkaKPYcySk1xHCuW3yRzNERO6LZ95lRP-nD8fdTfE
```

**Important**: 
- Set these for **Production**, **Preview**, and **Development** environments
- Click "Save" after adding each variable

## Step 2: Configure Build Settings

If Vercel auto-detected your framework incorrectly, update these settings:

1. Go to **Settings** → **General**
2. Update build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 3: Deploy

### Option A: Deploy from Vercel Dashboard
1. Go to your project in Vercel
2. Click **Deployments** → **Redeploy** (with latest commit)
3. Wait for deployment to complete

### Option B: Deploy from Git Push
1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push origin main
   ```
2. Vercel will automatically deploy

## Step 4: Verify Deployment

After deployment completes:

1. **Check Build Logs**: Look for any errors in the build logs
2. **Test Environment Variables**: 
   - Open browser console on your deployed site
   - Should see: "VITE_SUPABASE_URL: present"
   - Should see: "VITE_SUPABASE_ANON_KEY: present"
3. **Test Authentication**: Try signing up/logging in
4. **Test Database**: Check if data loads from Supabase

## Troubleshooting

### White Screen Issue
**Cause**: Missing environment variables or build errors

**Solution**:
1. Verify environment variables are set in Vercel
2. Check build logs for errors
3. Redeploy after adding environment variables
4. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)

### Data Not Syncing with Supabase
**Cause**: Incorrect Supabase credentials or CORS issues

**Solution**:
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
2. Check Supabase console for:
   - RLS policies are enabled
   - Tables exist in `public` schema
   - No rate limiting/quota issues
3. Add Vercel domain to Supabase allowed domains:
   - Go to Supabase Dashboard → Settings → API
   - Add your Vercel domain (e.g., `yourapp.vercel.app`)

### Build Fails
**Cause**: Missing dependencies or TypeScript errors

**Solution**:
1. Run `npm run build` locally first to catch errors
2. Fix any TypeScript errors
3. Commit and push fixes
4. Redeploy on Vercel

## Environment Variable Security

✅ **Safe to expose** (already in frontend code):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (anon/public key, rate-limited by RLS)

❌ **Never expose**:
- Supabase Service Role Key
- Database passwords
- API secrets

## Post-Deployment Checklist

- [ ] Environment variables added to Vercel
- [ ] Build completed successfully
- [ ] No console errors on deployed site
- [ ] Authentication works (signup/login)
- [ ] Products load from Supabase
- [ ] Cart functionality works
- [ ] Checkout creates orders in database
- [ ] Custom domain configured (optional)

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Add domain to Supabase allowed domains

## Monitoring

Monitor your deployment:
- **Vercel Analytics**: Track performance and errors
- **Supabase Dashboard**: Monitor database queries and API usage
- **Browser Console**: Check for JavaScript errors

## Quick Commands

```bash
# Test build locally before deploying
cd Frontend
npm run build

# Preview production build locally
npm run preview

# Check for errors
npm run build 2>&1 | grep -i error
```

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Check build logs in Vercel dashboard
- Check browser console for errors
