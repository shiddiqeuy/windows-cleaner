# Glossary

This document defines the domain terms for the Windows Cleaner project.

## Terms

### Deep Cleaner
The scanning and cleaning module targeted at system-level temporary files, including User Temp (`%TEMP%`), System Temp (`C:\Windows\Temp`), Prefetch (`C:\Windows\Prefetch`), Windows Update Download Cache (`SoftwareDistribution\Download`), Log Files (`*.log`), Crash Dumps (`*.dmp`), Windows Defender Cache, and Thumbnail Cache.

### Dry-Run Mode
An execution mode (`--dry-run` or `-d`) that scans target locations and reports estimated space reclaimable and candidate files without performing any actual deletions.

### Purge Operation
The execution phase (`windows-cleaner clean`) where candidate files are permanently removed from disk. Locked files or files requiring elevated permissions that fail deletion are skipped cleanly with logging.

### Scan Target
A specific directory, file pattern, or Windows subsystem location designated for cleaning.

### Subcommand
Primary mode of application invocation: `scan` (analyze and summarize) or `clean` (purge candidate files).

### File Age Threshold (`--min-age`)
A duration filter (e.g., `24h`, `7d`, `0d`) applied to file modification timestamps. Only files older than this threshold are marked as cleanup candidates to avoid purging active session files. Default is `24h`.

### Output Formatter
Terminal rendering system supporting interactive rich formatting (tables, colors, progress bars) for human users and structured JSON output (`--json`) for automated scripting.

### Administrator Elevation (UAC Check)
The process of checking if the current process is running with elevated privileges (`IsUserAnAdmin`). If required system targets (e.g. `SoftwareDistribution` or `Prefetch`) are scanned without Admin rights, a warning badge is displayed and elevated re-launch options are offered.


