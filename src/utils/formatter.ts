import chalk from 'chalk';
import Table from 'cli-table3';
import bytes from 'bytes';
import { ScanSummary, CleanResult } from '../types.js';

export function formatBytes(sizeBytes: number): string {
  if (sizeBytes === 0) return '0 B';
  return bytes(sizeBytes, { decimalPlaces: 2 }) || `${sizeBytes} B`;
}

export function renderScanTable(summary: ScanSummary): string {
  const output: string[] = [];

  output.push('');
  output.push(chalk.bold.cyan('==============================================================='));
  output.push(chalk.bold.cyan('                 WINDOWS CLEANER SCAN REPORT                   '));
  output.push(chalk.bold.cyan('==============================================================='));
  output.push('');

  const adminBadge = summary.isAdmin 
    ? chalk.bgGreen.black.bold(' ELEVATED (ADMIN) ') 
    : chalk.bgYellow.black.bold(' USER MODE (NON-ADMIN) ');

  output.push(`Privilege Mode : ${adminBadge}`);
  output.push(`Min-Age Filter : ${chalk.yellow(bytes(summary.minAgeMs) ? summary.minAgeMs / (1000 * 60 * 60) + ' hours' : '0 hours')}`);
  output.push(`Scan Duration  : ${chalk.green((summary.scanTimeMs / 1000).toFixed(2) + ' seconds')}`);
  output.push('');

  const table = new Table({
    head: [
      chalk.white.bold('Category'),
      chalk.white.bold('Files'),
      chalk.white.bold('Reclaimable Size'),
      chalk.white.bold('Status / Permissions')
    ],
    colWidths: [26, 10, 20, 26]
  });

  for (const res of summary.categories) {
    let status = chalk.green('Ready to Clean');
    if (res.requiresAdmin && !summary.isAdmin) {
      status = chalk.yellow('⚠️ Needs Admin Privilege');
    } else if (res.accessDenied) {
      status = chalk.red('❌ Access Denied');
    } else if (res.candidateCount === 0) {
      status = chalk.dim('Clean (0 files)');
    }

    table.push([
      chalk.bold(res.category.name),
      res.candidateCount.toString(),
      chalk.yellow.bold(formatBytes(res.totalSizeBytes)),
      status
    ]);
  }

  output.push(table.toString());
  output.push('');
  output.push(chalk.bold(`Total Reclaimable Space: ${chalk.green.bold(formatBytes(summary.totalSizeBytes))} (${summary.totalFileCount} files)`));

  if (!summary.isAdmin) {
    output.push('');
    output.push(chalk.yellow('💡 Note: Some system locations (Prefetch, Windows Update Downloads) require Administrator rights.'));
    output.push(chalk.yellow('   Run PowerShell as Administrator to scan/clean all locations.'));
  }

  output.push('');
  return output.join('\n');
}

export function renderCleanTable(cleanResult: CleanResult): string {
  const output: string[] = [];

  output.push('');
  output.push(chalk.bold.magenta('==============================================================='));
  output.push(chalk.bold.magenta(cleanResult.dryRun ? '             WINDOWS CLEANER DRY-RUN REPORT (PREVIEW)           ' : '                 WINDOWS CLEANER CLEANUP REPORT                '));
  output.push(chalk.bold.magenta('==============================================================='));
  output.push('');

  output.push(`Execution Mode : ${cleanResult.dryRun ? chalk.bgYellow.black.bold(' DRY-RUN (NO FILES DELETED) ') : chalk.bgRed.white.bold(' PURGE MODE (PERMANENT DELETE) ')}`);
  output.push(`Duration       : ${chalk.green((cleanResult.cleanTimeMs / 1000).toFixed(2) + ' seconds')}`);
  output.push('');

  const table = new Table({
    head: [
      chalk.white.bold('Category'),
      chalk.white.bold('Deleted'),
      chalk.white.bold('Freed Space'),
      chalk.white.bold('Skipped / Locked')
    ],
    colWidths: [26, 10, 20, 22]
  });

  for (const cat of cleanResult.categoryResults) {
    table.push([
      chalk.bold(cat.categoryName),
      cat.deletedCount.toString(),
      chalk.green.bold(formatBytes(cat.deletedBytes)),
      cat.skippedLockedCount > 0 ? chalk.yellow(`${cat.skippedLockedCount} locked`) : chalk.dim('0')
    ]);
  }

  output.push(table.toString());
  output.push('');

  if (cleanResult.dryRun) {
    output.push(chalk.bold.yellow(`Estimated Total Freed Space: ${chalk.green.bold(formatBytes(cleanResult.totalDeletedBytes))} (${cleanResult.totalDeletedCount} candidate files)`));
    output.push(chalk.dim('Run `windows-cleaner clean --yes` to execute actual file deletion.'));
  } else {
    output.push(chalk.bold.green(`Total Reclaimed Disk Space: ${chalk.green.bold(formatBytes(cleanResult.totalDeletedBytes))} (${cleanResult.totalDeletedCount} files removed)`));
    if (cleanResult.totalSkippedCount > 0) {
      output.push(chalk.yellow(`Skipped ${cleanResult.totalSkippedCount} locked/in-use files.`));
    }
  }

  output.push('');
  return output.join('\n');
}
