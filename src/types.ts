export type CategoryId = 
  | 'temp' 
  | 'system_temp' 
  | 'prefetch' 
  | 'updates' 
  | 'logs' 
  | 'dumps' 
  | 'defender' 
  | 'thumbnails'
  | 'recycle_bin'
  | 'browser_cache'
  | 'dev_cache'
  | 'event_logs'
  | 'delivery_optimization';

export interface TargetCategory {
  id: CategoryId;
  name: string;
  description: string;
  paths: string[];
  requiresAdmin: boolean;
  patterns?: RegExp[];
}

export interface ScannedFile {
  filePath: string;
  sizeBytes: number;
  lastModified: Date;
  categoryId: CategoryId;
  isLocked?: boolean;
}

export interface CategoryScanResult {
  category: TargetCategory;
  files: ScannedFile[];
  totalSizeBytes: number;
  candidateCount: number;
  requiresAdmin: boolean;
  accessDenied: boolean;
  skippedLockedCount: number;
}

export interface ScanSummary {
  categories: CategoryScanResult[];
  totalSizeBytes: number;
  totalFileCount: number;
  scanTimeMs: number;
  minAgeMs: number;
  isAdmin: boolean;
}

export interface CleanResult {
  categoryResults: {
    categoryId: CategoryId;
    categoryName: string;
    deletedCount: number;
    deletedBytes: number;
    failedCount: number;
    skippedLockedCount: number;
  }[];
  totalDeletedBytes: number;
  totalDeletedCount: number;
  totalFailedCount: number;
  totalSkippedCount: number;
  cleanTimeMs: number;
  dryRun: boolean;
}
