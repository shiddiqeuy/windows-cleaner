#!/usr/bin/env node
import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import readline from 'node:readline';
import { runFullScan, getTargetCategories } from './scanner.js';
import { runCleanup } from './cleaner.js';
import { parseDurationMs } from './utils/time.js';
import { renderScanTable, renderCleanTable, formatBytes } from './utils/formatter.js';
import { CategoryId } from './types.js';

const program = new Command();

program
  .name('windows-cleaner')
  .description('High-performance CLI disk cleanup tool for Windows')
  .version('1.0.0');

// Subcommand: SCAN
program
  .command('scan')
  .description('Scan target directories and calculate reclaimable disk space')
  .option('-c, --category <categories>', 'Filter categories separated by comma (temp,system_temp,prefetch,updates,logs,dumps,thumbnails) or "all"', 'all')
  .option('-m, --min-age <duration>', 'Filter files older than duration (e.g. 24h, 7d, 0d)', '24h')
  .option('-j, --json', 'Output report in JSON format', false)
  .action(async (options) => {
    const minAgeMs = parseDurationMs(options.minAge);
    const categoryIds = parseCategoryInput(options.category);

    const spinner = options.json ? null : ora('Scanning target directories...').start();

    try {
      const scanSummary = await runFullScan(categoryIds, minAgeMs);

      if (spinner) {
        spinner.succeed('Scan completed!');
      }

      if (options.json) {
        console.log(JSON.stringify(scanSummary, null, 2));
      } else {
        console.log(renderScanTable(scanSummary));
      }
    } catch (err: any) {
      if (spinner) spinner.fail('Scan failed');
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

// Subcommand: CLEAN
program
  .command('clean')
  .description('Scan and purge temporary files and system junk')
  .option('-c, --category <categories>', 'Filter categories separated by comma or "all"', 'all')
  .option('-m, --min-age <duration>', 'Filter files older than duration (e.g. 24h, 7d, 0d)', '24h')
  .option('-d, --dry-run', 'Simulate deletion without actually removing files', false)
  .option('-y, --yes', 'Skip confirmation prompt', false)
  .option('-j, --json', 'Output report in JSON format', false)
  .action(async (options) => {
    const minAgeMs = parseDurationMs(options.minAge);
    const categoryIds = parseCategoryInput(options.category);

    const spinner = options.json ? null : ora('Scanning target directories for cleanup...').start();

    try {
      const scanSummary = await runFullScan(categoryIds, minAgeMs);

      if (spinner) {
        spinner.succeed('Scan completed!');
      }

      if (scanSummary.totalFileCount === 0) {
        if (options.json) {
          console.log(JSON.stringify({ message: 'No files to clean', summary: scanSummary }, null, 2));
        } else {
          console.log(chalk.green('\n✨ System is already clean! No candidate files found.'));
        }
        return;
      }

      // If interactive & not --yes & not --dry-run, ask confirmation
      if (!options.dryRun && !options.yes && !options.json) {
        console.log(renderScanTable(scanSummary));
        const confirmed = await askConfirmation(
          chalk.yellow.bold(`Are you sure you want to permanently delete ${scanSummary.totalFileCount} files (${formatBytes(scanSummary.totalSizeBytes)} space)? [y/N]: `)
        );

        if (!confirmed) {
          console.log(chalk.blue('Cleanup aborted by user.'));
          return;
        }
      }

      const cleanSpinner = options.json ? null : ora(options.dryRun ? 'Simulating cleanup...' : 'Purging files...').start();
      const cleanResult = await runCleanup(scanSummary, options.dryRun);

      if (cleanSpinner) {
        cleanSpinner.succeed(options.dryRun ? 'Dry-run preview completed!' : 'Cleanup completed!');
      }

      if (options.json) {
        console.log(JSON.stringify(cleanResult, null, 2));
      } else {
        console.log(renderCleanTable(cleanResult));
      }
    } catch (err: any) {
      if (spinner) spinner.fail('Cleanup failed');
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

function parseCategoryInput(input: string): CategoryId[] | 'all' {
  if (!input || input.trim().toLowerCase() === 'all') {
    return 'all';
  }
  const validIds: CategoryId[] = ['temp', 'system_temp', 'prefetch', 'updates', 'logs', 'dumps', 'thumbnails'];
  const split = input.split(',').map((s) => s.trim().toLowerCase()) as CategoryId[];
  return split.filter((id) => validIds.includes(id));
}

function askConfirmation(questionText: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(questionText, (answer) => {
      rl.close();
      const lower = answer.trim().toLowerCase();
      resolve(lower === 'y' || lower === 'yes');
    });
  });
}

program.parse();
