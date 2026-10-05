/**
 * Parses duration strings into milliseconds.
 * Supported formats: '24h', '7d', '30m', '3600s', '0d', '0h'.
 * Defaults to 24 hours if parsing fails.
 */
export function parseDurationMs(durationStr: string): number {
  if (!durationStr) {
    return 24 * 60 * 60 * 1000; // 24h default
  }

  const str = durationStr.trim().toLowerCase();
  if (str === '0' || str === '0d' || str === '0h' || str === '0m' || str === '0s') {
    return 0;
  }

  const regex = /^(\d+(?:\.\d+)?)\s*([a-z]+)?$/;
  const match = str.match(regex);

  if (!match) {
    return 24 * 60 * 60 * 1000;
  }

  const num = parseFloat(match[1]);
  const unit = match[2] || 'h';

  switch (unit) {
    case 's':
    case 'sec':
    case 'second':
    case 'seconds':
      return num * 1000;
    case 'm':
    case 'min':
    case 'minute':
    case 'minutes':
      return num * 60 * 1000;
    case 'h':
    case 'hr':
    case 'hour':
    case 'hours':
      return num * 60 * 60 * 1000;
    case 'd':
    case 'day':
    case 'days':
      return num * 24 * 60 * 60 * 1000;
    case 'w':
    case 'week':
    case 'weeks':
      return num * 7 * 24 * 60 * 60 * 1000;
    default:
      return num * 60 * 60 * 1000;
  }
}
