import { execSync } from 'node:child_process';

/**
 * Checks if the current Node.js process is running with Administrator privileges on Windows.
 */
export function checkIsAdmin(): boolean {
  if (process.platform !== 'win32') {
    return false;
  }
  try {
    // 'net session' exits with 0 if Administrator, non-zero otherwise
    execSync('net session', { stdio: 'ignore' });
    return true;
  } catch {
    try {
      // Backup check using fltmc
      execSync('fltmc', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}
