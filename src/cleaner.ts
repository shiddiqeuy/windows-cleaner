import fs from 'node:fs';
import { ScanSummary, CleanResult, CategoryId } from './types.js';

export async function runCleanup(
  scanSummary: ScanSummary,
  dryRun = false
): Promise<CleanResult> {
  const startTime = Date.now();
  const categoryResults = [];

  let totalDeletedBytes = 0;
  let totalDeletedCount = 0;
  let totalFailedCount = 0;
  let totalSkippedCount = 0;

  for (const catResult of scanSummary.categories) {
    let catDeletedCount = 0;
    let catDeletedBytes = 0;
    let catFailedCount = 0;
    let catSkippedLockedCount = 0;

    for (const file of catResult.files) {
      if (dryRun) {
        catDeletedCount++;
        catDeletedBytes += file.sizeBytes;
      } else {
        try {
          // Attempt to delete file
          await fs.promises.unlink(file.filePath);
          catDeletedCount++;
          catDeletedBytes += file.sizeBytes;
        } catch (err: any) {
          if (err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'EACCES') {
            catSkippedLockedCount++;
          } else {
            catFailedCount++;
          }
        }
      }
    }

    totalDeletedCount += catDeletedCount;
    totalDeletedBytes += catDeletedBytes;
    totalFailedCount += catFailedCount;
    totalSkippedCount += catSkippedLockedCount;

    categoryResults.push({
      categoryId: catResult.category.id,
      categoryName: catResult.category.name,
      deletedCount: catDeletedCount,
      deletedBytes: catDeletedBytes,
      failedCount: catFailedCount,
      skippedLockedCount: catSkippedLockedCount
    });
  }

  const cleanTimeMs = Date.now() - startTime;

  return {
    categoryResults,
    totalDeletedBytes,
    totalDeletedCount,
    totalFailedCount,
    totalSkippedCount,
    cleanTimeMs,
    dryRun
  };
}
