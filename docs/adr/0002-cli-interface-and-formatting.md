# 2. CLI Interface Structure and Output Formatting

Date: 2026-10-05

## Status

Accepted

## Context

The Windows Cleaner application is a Rust CLI tool. We need to establish the command invocation structure, flag conventions, filtering logic, and terminal rendering modes.

## Decision

1. **Subcommand Invocation Structure**:
   - `windows-cleaner scan`: Discovers cleanup candidates, calculates disk space savings, and prints a report.
   - `windows-cleaner clean`: Scans and executes file deletion. Supports `--dry-run` to preview deletions.
   - Global / Shared flags:
     - `--category <all|temp|prefetch|logs|updates|dumps|defender>` (default: `all`)
     - `--min-age <duration>` (e.g. `24h`, `7d`, `0d`, default: `24h`)
     - `--yes` / `-y`: Skip interactive confirmation prompt on `clean`.
     - `--json`: Output machine-readable JSON format instead of terminal UI.

2. **Terminal Rendering**:
   - Human mode: Uses `comfy-table` / `colored` / `indicatif` for interactive spinners, colored status badges, and formatted summary tables.
   - Machine mode (`--json`): Outputs valid JSON payload containing scan metrics, space savings in bytes, candidate counts, and status per target category.

3. **File Safety & Age Threshold**:
   - Applies a default 24-hour minimum age check (`--min-age 24h`) on file modification times before flagging a file as a candidate.
   - Locked files (`PermissionDenied` / in-use handle) are caught safely, skipped, and recorded in scan statistics.

## Consequences

- Clear CLI ergonomics following modern Rust CLI conventions (`clap` crate v4).
- Safe default behavior preventing accidental deletion of files created during current active user sessions.
