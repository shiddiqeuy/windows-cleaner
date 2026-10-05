# 1. Node.js v24 + TypeScript CLI Architecture for Windows Cleaner

Date: 2026-10-05

## Status

Accepted (Supersedes previous Rust proposal due to environment availability of Node v24.17.0)

## Context

We need a high-performance Windows Cleaner CLI application. The system environment has Node.js v24.17.0 pre-installed.

## Decision

We will build the CLI application using **Node.js v24 + TypeScript**.

Key rationale:
1. **Pre-installed System Runtime**: Node.js v24.17.0 is natively installed and available.
2. **Asynchronous & Worker Threads Concurrency**: High-performance non-blocking I/O and `worker_threads` for parallel directory scanning.
3. **Rich CLI Ecosystem**: `commander` (CLI subcommands), `chalk` (colored terminal output), `cli-table3` (formatted tables), `ora` (interactive spinners).
4. **Single Executable Option**: Can be bundled into a standalone executable (`windows-cleaner.exe`) via Node.js Single Executable Applications (SEA) or `pkg`.

## Consequences

- Leverages existing Node.js environment without additional toolchain installation.
- Fast execution speed with TypeScript safety (`tsx` / `tsc`).
