#!/usr/bin/env node
import { Command } from 'commander';
import { TosSaladDB } from './database/supabase';
import { collectCommand } from './commands/collect';
import { analyzeCommand } from './commands/analyze';
import { exportCommand } from './commands/export';

const program = new Command();

program
  .name('tos-salad')
  .description('ToS Salad - Expose corporate Terms of Service manipulation through radical transparency')
  .version('1.0.0');

// Initialize database
const db = new TosSaladDB();

program
  .command('collect')
  .description('Scrape and collect Terms of Service documents from a company')
  .argument('<domain>', 'Company domain to analyze (e.g., microsoft.com)')
  .option('-t, --type <type>', 'Document type to collect', 'terms_of_service')
  .option('-v, --verbose', 'Verbose output')
  .action(async (domain, options) => {
    await collectCommand(db, domain, options);
  });

program
  .command('analyze')
  .description('Analyze collected ToS documents using AI')
  .argument('<company>', 'Company name or domain to analyze')
  .option('-m, --model <model>', 'AI model to use', 'gemini-2.0-flash')
  .option('-v, --verbose', 'Verbose output')
  .action(async (company, options) => {
    await analyzeCommand(db, company, options);
  });

program
  .command('export')
  .description('Export analysis results in various formats')
  .option('-f, --format <format>', 'Export format (json|csv|markdown)', 'json')
  .option('-o, --output <file>', 'Output file path')
  .option('-c, --company <company>', 'Filter by company')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    await exportCommand(db, options);
  });

program.parse();
