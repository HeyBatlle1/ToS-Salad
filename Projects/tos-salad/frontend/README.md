# ToS Salad Frontend

React/Next.js frontend for the ToS Salad transparency research platform.

## Features

- **Chat Interface**: Conversational AI assistant powered by Gemini 2.0 Flash
- **Company Reports**: Transparency scores and red flag analysis 
- **Source Verification**: Real-time checking of document accessibility
- **Mobile Responsive**: Optimized for all device sizes
- **Production Ready**: Rate limiting, caching, and error handling

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Styling**: Tailwind CSS with responsive design
- **Database**: Supabase integration (same tables as CLI)
- **AI**: Google Gemini API for chat and analysis
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Development Commands

```bash
# Development with Turbopack
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build

# Production server
npm start
```

## Architecture

### API Routes (`/api`)
- `/api/chat` - Gemini-powered transparency assistant
- `/api/companies` - Company data with caching
- `/api/analysis/[id]` - Individual analysis with source verification
- `/api/verify-source` - URL accessibility checking

### Components (`/components`)
- `chat/ChatInterface` - Real-time chat with AI assistant
- `companies/CompanyCard` - Company transparency summary cards
- `companies/TransparencyScore` - Visual score display with trends
- `companies/RedFlagsList` - Expandable red flag details
- `SourceVerification` - URL status checking with error handling

### Pages (`/app`)
- `/` - Landing page with split chat interface
- `/companies` - Company grid with search/filter/sort
- `/companies/[slug]` - Individual company reports (coming soon)

## Database Integration

Uses the same Supabase tables as the CLI tool:
- `tos_analysis_companies` - Company information
- `tos_analysis_documents` - Scraped ToS documents  
- `tos_analysis_results` - AI analysis results with red flags

## Production Considerations

### Rate Limiting
- Gemini API calls: 30 requests/minute per IP
- Configurable via `RATE_LIMIT_REQUESTS_PER_MINUTE`

### Caching
- Company data cached for 1 hour by default
- Configurable via `CACHE_TTL_SECONDS`

### Error Handling
- Graceful degradation for API failures
- Source verification with timeout handling
- User-friendly error messages

### Performance
- Turbopack for fast development builds
- Image optimization with WebP/AVIF
- Component-level loading states

## Fair Use Compliance

The frontend maintains the same fair use principles as the CLI:
- Quotes specific problematic clauses for analysis
- Provides educational commentary and consumer impact explanations
- Links to original sources for verification
- Focuses on transparency research and advocacy

## Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (recommended):
   ```bash
   npx vercel
   ```

3. **Environment variables**: Set production environment variables in your deployment platform

## Contributing

When making changes:
1. Run `npm run typecheck` to verify TypeScript
2. Test mobile responsiveness across breakpoints
3. Verify API rate limits work correctly
4. Ensure source verification handles edge cases
5. Test chat interface with various queries

The frontend is designed to democratize the CLI tool's transparency research capabilities through an accessible web interface.
