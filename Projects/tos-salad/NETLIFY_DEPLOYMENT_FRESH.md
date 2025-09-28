# ToS Salad - Fresh Netlify Deployment Guide

## 🚀 Netlify-Optimized Deployment

This fresh deployment removes Supabase dependencies and optimizes for Netlify with Neon PostgreSQL.

## ✅ Completed Optimizations

### 1. ✅ Repository Cloned
- Fresh clone from GitHub: `https://github.com/HeyBatlle1/ToS-Salad`
- Clean working directory: `/tos-salad-netlify-clean`

### 2. ✅ Supabase Removal Complete
- Removed `@supabase/supabase-js` dependency
- Deleted Supabase configuration files
- Updated all components to use direct database connections
- Simplified authentication (public access mode)

### 3. ✅ Neon Database Integration
- Created `src/lib/database.ts` with PostgreSQL connection
- Added `pg` and `@types/pg` dependencies
- Optimized connection pooling for serverless functions
- Implemented proper error handling and cleanup

### 4. ✅ Netlify Configuration
- Updated `next.config.ts` for standalone output
- Configured `serverExternalPackages` for PostgreSQL
- Created production-ready `netlify.toml`
- Optimized build commands and environment

### 5. ✅ Environment Variables
- Created environment validation system
- Updated `.env.example` files
- Required variables: `DATABASE_URL`, `GOOGLE_GEMINI_API_KEY`
- Optional: `CACHE_TTL_SECONDS`, `NODE_ENV`

### 6. ✅ Build Testing
- Dependencies installed successfully
- Build process completes without errors
- All API routes properly configured
- Health check endpoint created at `/api/health`

## 🗄️ Database Setup

Your Neon database needs the ToS analysis data. Based on the existing codebase, this includes **27 company analyses** with:

- Company metadata (name, domain, industry)
- Terms of service documents
- AI analysis results with transparency scores
- Red flag detection and explanations

## 🌐 Deployment Steps

### 1. Netlify Configuration

**Build Settings:**
```
Base directory: frontend
Build command: npm install && npm run build
Publish directory: .next
Node version: 18
```

**Environment Variables:**
```
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
CACHE_TTL_SECONDS=60
NODE_ENV=production
```

### 2. Deploy & Verify

**Essential Verification:**
- `/api/health` - Database connectivity check
- `/companies` - All 27 companies displayed
- `/chat` - AI Agent functionality
- `/companies/[domain]` - Individual analysis pages

## 🎯 Success Criteria

✅ **All 27 Company Analyses Accessible**
- Companies like Google, Microsoft, Facebook, etc.
- Each with transparency scores and red flag analysis

✅ **AI Agent Functional**
- Responds to ToS questions using Gemini
- Provides context-aware transparency insights

✅ **Quote-and-Explain Methodology**
- Proper fair use implementation
- Source attribution and educational analysis

✅ **Performance Optimized**
- Serverless-ready connection pooling
- Optimized for Netlify Functions
- Fast page loads and responsive design

## 🚨 Migration Notes

### Key Changes Made:
1. **Database Layer**: Replaced Supabase with direct PostgreSQL connections
2. **Authentication**: Simplified to public access (no auth complexity)
3. **Build Process**: Optimized for Netlify serverless functions
4. **Environment**: Proper validation and error handling
5. **Dependencies**: Minimal, focused package list

### API Endpoints:
- `/api/companies` - Company listing with analysis data
- `/api/companies?domain=X` - Individual company lookup
- `/api/analysis/[id]` - Detailed analysis data
- `/api/chat` - AI agent interactions
- `/api/health` - System health check

The platform is now ready for a clean Netlify deployment with all transparency analysis data preserved and optimized for serverless performance.