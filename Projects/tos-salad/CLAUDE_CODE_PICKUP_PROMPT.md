# CLAUDE CODE PICKUP PROMPT - ToS Salad Systematic Integration

## 🎯 CURRENT STATE
You are continuing systematic integration of genuine ToS analysis data into the ToS Salad transparency platform. The previous Claude Code instance successfully completed Verizon analysis integration.

## 📊 VERIFIED COMPLETION STATUS
- **11 companies** now have verified genuine analysis (up from 9)
- **21 companies** still awaiting real analysis data
- Database cleaning completed - all fabricated data removed, company cards preserved
- LinkedIn and Verizon integrations successfully completed with full verification

## 🛠️ CURRENT ENVIRONMENT
- **Working Directory**: `/Users/burtonstuff/Projects/tos-salad`
- **Supabase Database**: `https://fbjjqwfcmzrpmytieajp.supabase.co`
- **API Key**: Available in `.env` file as `SUPABASE_ANON_KEY`
- **Gemini Integration**: Model `gemini-2.0-flash`, temperature 0.85

## ✅ COMPLETED INTEGRATIONS
**Latest verified genuine analyses:**
1. Bank of America - 8/100, 13 red flags
2. Fathom - 35/100, 7 red flags
3. GitHub - 40/100, 6 red flags
4. Otter.ai - 22/100, 9 red flags
5. Reddit - 18/100, 8 red flags
6. Telegram - 45/100, 6 red flags
7. TikTok - 12/100, 14 red flags
8. Verizon - 15/100, 7 red flags (just completed)
9. YouTube - 18/100, 7 red flags
10. **LinkedIn - 25/100, 6 red flags** (recently integrated)
11. **Verizon - 15/100, 7 red flags** (just completed - API issue resolved)

## 🚨 CRITICAL POLICIES
- **NO FABRICATION POLICY**: Never create fake analysis content
- **PRESERVE COMPANY CARDS**: Never delete company records, only clear analysis data
- **QUOTE-AND-EXPLAIN FORMAT**: All analysis must contain actual ToS quotes with explanations
- **SYSTEMATIC VERIFICATION**: Every integration requires full verification protocol

## 📋 PRIORITY COMPANIES AWAITING ANALYSIS
**HIGH PRIORITY** (9 companies):
1. Apple - Major platform
2. Discord - Popular communication
3. Microsoft - Major tech company
4. OpenAI - AI ethics importance
5. PayPal - Financial services
6. Google (policies.google.com) - Major platform
7. Spotify - Music streaming
8. Slack - Workplace communication
9. Anthropic - AI company

**MEDIUM PRIORITY** (6 companies):
10. Chase - Banking services
11. Replit - Developer platform
12. Signal - Privacy messaging
13. Supabase - Developer platform
14. X (Twitter) - Social media

**META/EDUCATIONAL** (6 entries):
15-20. Various educational context cards

## 🔧 INTEGRATION PROTOCOL
When user provides genuine analysis content, use this exact protocol:

### 1. LOCATE COMPANY RECORD
```javascript
const { data: company, error } = await supabase
  .from('tos_analysis_companies')
  .select('*')
  .eq('domain', 'COMPANY_DOMAIN')
  .single();
```

### 2. DELETE EXISTING FABRICATED DATA
```javascript
// Delete analysis results first (foreign key constraint)
await supabase
  .from('tos_analysis_results')
  .delete()
  .eq('company_id', company.id);
```

### 3. STORE GENUINE ANALYSIS
Update or create document with exact provided content in `raw_content` field

### 4. EXTRACT RED FLAGS
Parse the analysis content to identify red flags with:
- category
- concern
- originalText (exact quote)
- explanation

### 5. CREATE ANALYSIS RESULTS
Calculate scores and create structured analysis results with:
- transparency_score (from provided analysis)
- concerning_clauses (extracted red flags)
- key_concerns, recommendations arrays
- executive_summary

### 6. VERIFICATION
Retrieve and confirm storage with full verification report

## 🚀 NEXT ACTION WHEN USER PROVIDES ANALYSIS
1. Read the analysis content they provide
2. Identify which company it's for
3. Run the integration protocol using the existing pattern from `integrate-linkedin-analysis.js` or `integrate-verizon-analysis.js`
4. Provide full verification report
5. Update this pickup prompt with new completion status

## 📁 KEY FILES TO REFERENCE
- `integrate-linkedin-analysis.js` - Template for integration protocol
- `integrate-verizon-analysis.js` - Most recent successful integration
- `priority-analysis-list.md` - Current state tracking
- `clean-database.js` - Database cleaning protocol (completed)

## 🎯 IMMEDIATE READINESS
You are ready to receive genuine analysis content from the user and immediately begin systematic integration using the established protocol. The database is clean, verification systems are in place, and the integration pattern is proven.

**STATUS**: Ready for next genuine analysis integration.