# Vercel Deployment Guide for Legacy App

## Current Status
✅ Vercel CLI installed (v44.7.3)
✅ Logged in to Vercel (edureelz@gmail.com)
🔄 Deployment in progress...

## Deployment Steps

### 1. Initial Setup (Currently Running)
The command `cd legacy-app && vercel` is running and asking:
```
? Set up and deploy "~/Library/Mobile Documents/com~apple~CloudDocs/project/legacy-app"? (Y/n)
```

**Response:** Type `Y` or press Enter

### 2. Expected Prompts & Responses:
1. **Set up and deploy?** → `Y` (or press Enter)
2. **Which scope?** → Select your account
3. **Link to existing project?** → `N` (creating new)
4. **Project name?** → `legacy-app` (or press Enter for default)
5. **Directory with code?** → `./` (press Enter)
6. **Override build settings?** → `N`

### 3. After Initial Deployment
Once the first deployment completes, you'll need to add environment variables:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
```

### 4. Production Deployment
```bash
vercel --prod
```

### 5. Expected Result
You'll get a production URL like: `https://legacy-app.vercel.app`

## Environment Variables Needed
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `RESEND_API_KEY`: Your Resend API key for email sending

## Next Steps
1. Complete the current deployment prompts
2. Add environment variables
3. Deploy to production
4. Test the magic link authentication on the live site
