# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ToS Salad is a Node.js CLI tool for Terms of Service analysis and transparency research. It scrapes ToS documents from company websites, uses AI analysis to identify predatory clauses and consumer manipulation tactics, and exports findings for educational and research purposes.

## Tech Stack

- **Runtime**: Node.js
- **CLI Framework**: Commander.js for command-line interface
- **Web Scraping**: Puppeteer for browser automation and document extraction
- **Database**: PostgreSQL (NeonDB) for storing analysis results
- **AI Analysis**: Google Gemini API for clause analysis and manipulation detection
- **Language**: TypeScript/JavaScript

## Core Architecture

The application follows a modular CLI architecture:

- **CLI Layer**: Commander.js handles command parsing and user interaction
- **Scraping Module**: Puppeteer-based web scraper for ToS document extraction
- **Analysis Engine**: Google Gemini integration for AI-powered clause analysis
- **Database Layer**: PostgreSQL schemas for storing companies, documents, and analysis results
- **Export System**: Multiple format exporters for research data (JSON, CSV, Markdown reports)

## Development Commands

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run development mode with auto-reload
npm run dev

# Run the CLI tool locally
npm start [command] [options]

# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run typecheck
```

## CLI Usage Patterns

The tool implements subcommands for different operations:
- `tos-salad scrape <company>` - Scrape and analyze a company's ToS
- `tos-salad analyze <document-id>` - Re-analyze existing document
- `tos-salad export <format>` - Export analysis results
- `tos-salad list` - List analyzed companies/documents

## Database Schema Considerations

Key entities include:
- Companies (name, domain, industry)
- ToS Documents (versions, scrape dates, raw content)
- Analysis Results (flagged clauses, manipulation scores, explanations)
- Export Jobs (format, filters, status)

## Fair Use Compliance

The tool implements "quote and explain" methodology:
- Extracts specific problematic clauses (fair use quotation)
- Provides educational analysis of consumer impact
- Generates research reports for transparency advocacy
- Maintains attribution and source links

## Environment Configuration

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string (NeonDB)
- `GEMINI_API_KEY` - Google Gemini API authentication
- `SCRAPE_USER_AGENT` - Custom user agent for web scraping
- `RATE_LIMIT_MS` - Request throttling for responsible scraping

## Error Handling Patterns

- Graceful handling of scraping failures (rate limits, blocked requests)
- Database transaction rollbacks for failed analyses
- API quota management for Gemini requests
- User-friendly CLI error messages with actionable guidance