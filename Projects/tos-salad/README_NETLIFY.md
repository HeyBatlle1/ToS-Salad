# ToS Salad - Netlify Optimized Version

## 🌟 Overview

This is the Netlify-optimized version of ToS Salad, a transparency platform for analyzing Terms of Service documents. This version has been completely refactored for serverless deployment with Neon PostgreSQL.

## 🚀 Key Features

- **27 Company Analyses** - Comprehensive ToS analysis for major platforms
- **AI-Powered Insights** - Google Gemini integration for intelligent explanations
- **Transparency Scoring** - Numerical transparency ratings for each company
- **Quote-and-Explain** - Fair use methodology with proper attribution
- **Red Flag Detection** - Automated identification of concerning clauses

## 🏗️ Architecture

### Frontend (Next.js 15.5.3)
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS
- **Components**: React Server Components + Client Components
- **Deployment**: Netlify with serverless functions

### Backend
- **Database**: Neon PostgreSQL (serverless)
- **AI**: Google Gemini 2.0 Flash
- **API**: Next.js API routes as Netlify functions

### Key Optimizations
- Serverless-optimized connection pooling
- Minimal dependencies (removed Supabase)
- Environment variable validation
- Health check endpoints
- Production-ready error handling

## 📦 Quick Deploy

### Prerequisites
- Netlify account
- Neon database with ToS analysis data
- Google Gemini API key

### Deploy to Netlify
1. **Connect Repository**: Link this repo to Netlify
2. **Build Settings**: Use `frontend` as base directory
3. **Environment Variables**: Set `DATABASE_URL` and `GOOGLE_GEMINI_API_KEY`
4. **Deploy**: Automatic deployment with our optimized `netlify.toml`

### Environment Variables Required
```env
DATABASE_URL=postgresql://...
GOOGLE_GEMINI_API_KEY=your_key_here
```

## 🎯 Verification

After deployment, verify these endpoints:

- **Health Check**: `/api/health`
- **Companies**: `/companies` (should show 27 companies)
- **AI Agent**: `/chat`
- **Individual Analysis**: `/companies/google.com`

## 📊 Expected Data

The platform showcases transparency analysis for:

- Google, Microsoft, Meta (Facebook)
- Apple, Amazon, Netflix, Spotify
- Twitter/X, LinkedIn, Reddit, Discord
- TikTok, YouTube, Instagram
- Banking: Chase, Bank of America, PayPal
- And many more...

Each analysis includes:
- Transparency score (0-100)
- Red flag identification
- Clause-by-clause breakdown
- Consumer impact assessment
- Regulatory compliance notes

## 🔧 Development

```bash
cd frontend
npm install
npm run dev
```

## 📋 Tech Stack

- **Next.js 15.5.3** - React framework
- **PostgreSQL** - Database (Neon)
- **Tailwind CSS** - Styling
- **Google Gemini** - AI analysis
- **Netlify** - Hosting & serverless functions

## 📞 Support

For deployment issues, check:
1. Environment variables are properly set
2. Database connectivity via `/api/health`
3. Build logs in Netlify dashboard

This optimized version provides a clean, fast, and reliable ToS transparency platform ready for production deployment.