# 3. Admin Elevation Detection and NPM Package Stack Selection

Date: 2026-10-05

## Status

Accepted

## Context

Scanning and cleaning certain system locations on Windows (`C:\Windows\Prefetch`, `C:\Windows\SoftwareDistribution\Download`, `SystemTemp`) requires Administrator elevation. We need a clear detection and warning strategy, plus agreement on the TypeScript/NPM package stack.

## Decision

1. **Administrator Elevation Strategy**:
   - Check process privileges using Windows `net session` or `fltmc` execution in Node.js.
   - If un-elevated, display clear status indicators in the terminal output for targets requiring Admin access (`[Requires Admin - Skipped/Warning]`).
   - Provide explicit guidance and an option to re-launch via UAC PowerShell elevation (`powershell Start-Process -Verb RunAs`).

2. **Approved TypeScript / NPM Stack**:
   - `commander`: Subcommands (`scan`, `clean`) and CLI argument parsing.
   - `chalk`: ANSI color styling for terminal output.
   - `cli-table3`: Bordered, formatted data tables.
   - `ora`: Elegant terminal spinners.
   - `bytes`: Formatting byte sizes into human readable units (B, KB, MB, GB).
   - `ms` / `parse-duration`: Duration parsing (`--min-age 24h`).
   - `typescript` & `tsx`: Fast TypeScript execution and compilation.

## Consequences

- Highly informative UX when running in non-elevated user mode.
- Fast, maintainable, and type-safe CLI execution using Node.js v24.
