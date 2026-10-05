# Windows Cleaner CLI 🧹

[![GitHub License](https://img.shields.io/github/license/shiddiqeuy/windows-cleaner?color=blue)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-green.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/platform-Windows%2010%20%7C%2011-0078D6.svg)](https://microsoft.com/windows)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](README.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)

A high-performance, safe, multi-threaded CLI disk cleanup application for Windows built with Node.js v24 & TypeScript.

---

## ⚡ Key Features

- **Expanded Target Coverage (5GB+ Reclaimable Potential)**:
  - 🛠️ **IDE Caches**: VS Code, Cursor, Antigravity IDE, Visual Studio (`Cache`, `CachedData`, `GPUCache`, `logs`).
  - 🤖 **AI Coding Tools**: OpenAI Codex, OpenAI Desktop, OpenCode AI caches & logs.
  - 📦 **Dev & Build Tool Caches**: Playwright binaries (`ms-playwright`), Go build cache, Electron cache, npm/pnpm/pip/Cargo package caches.
  - 🔄 **App Installer / Updaters**: Obsidian, OpenCode, Canva, Logseq installer updaters.
  - 🌐 **Browser Caches**: Chrome, Edge, Brave, Firefox (Web Cache, Code Cache, GPU Cache, Shader Cache).
  - 💻 **System & OS Caches**: User Temp (`%TEMP%`), System Temp (`C:\Windows\Temp`), Prefetch, Windows Update Cache (`SoftwareDistribution\Download`), Log Files (`*.log`), Memory Dumps (`*.dmp`), Explorer Thumbnail Caches (`thumbcache_*.db`), System Recycle Bin (`C:\$Recycle.Bin`).
- **Safety Safeguards**:
  - `--min-age` duration filter (default `24h`) prevents deletion of active session files.
  - Non-blocking error handling safely skips locked or in-use system files (`EBUSY`, `EPERM`).
  - `--dry-run` preview mode simulates deletion before performing actual purges.
- **Rich Terminal UI & Automation**:
  - Interactive colored summary tables (`cli-table3` + `chalk`) and progress spinners (`ora`).
  - Structured machine-readable `--json` output for automated scripts & CI pipelines.
  - Automatic Administrator privilege detection (`IsUserAnAdmin`).

---

## 🚦 Status

| Target Category | Status | Supported Locations |
| :--- | :--- | :--- |
| **User Temp Files** | ✅ Active | `%TEMP%` |
| **System Temp Files** | ⚠️ Needs Admin | `C:\Windows\Temp` |
| **Windows Prefetch** | ⚠️ Needs Admin | `C:\Windows\Prefetch` |
| **Windows Update Cache** | ⚠️ Needs Admin | `C:\Windows\SoftwareDistribution\Download` |
| **Browser Caches** | ✅ Active | Chrome, Edge, Brave, Firefox |
| **IDE Caches** | ✅ Active | VS Code, Cursor, Antigravity IDE, Visual Studio |
| **AI Tools Cache** | ✅ Active | Codex, OpenAI Desktop, OpenCode AI |
| **Dev & Build Caches** | ✅ Active | Playwright, Go build, Electron, npm, pnpm, pip, Cargo |
| **App Updaters** | ✅ Active | Obsidian, OpenCode, Canva, Logseq Updaters |
| **Event Logs** | ⚠️ Needs Admin | `C:\Windows\System32\winevt\Logs` |
| **Recycle Bin** | ⚠️ Needs Admin | `C:\$Recycle.Bin` |

---

## 🛠️ Installation & Build

```bash
# Clone repository
git clone https://github.com/shiddiqeuy/windows-cleaner.git
cd windows-cleaner

# Install dependencies
npm install

# Build TypeScript project
npm run build
```

---

## 💻 Usage

### 1. Scan Reclaimable Disk Space
```bash
# Full scan with interactive summary table
npm run scan

# Scan specific categories
npx tsx src/index.ts scan --category ide_cache,ai_tools_cache,dev_build_cache

# Filter by file age (e.g., files older than 7 days)
npx tsx src/index.ts scan --min-age 7d

# Machine-readable JSON output
npx tsx src/index.ts scan --json
```

### 2. Preview Cleanup (Dry-Run)
```bash
# Simulate deletion without modifying disk
npx tsx src/index.ts clean --dry-run
```

### 3. Execute Cleanup
```bash
# Interactive cleanup with confirmation prompt
npm run clean

# Non-interactive automated cleanup
npx tsx src/index.ts clean --yes
```

---

## 📁 Repository Structure & Documentation

- [AGENTS.md](AGENTS.md) - Agent skills configuration
- [GLOSSARY.md](GLOSSARY.md) - Domain glossary & terminology definitions
- [docs/adr/](docs/adr/) - Architectural Decision Records (ADRs):
  - [0001: Node.js v24 + TypeScript CLI Architecture](docs/adr/0001-nodejs-typescript-cli-architecture.md)
  - [0002: CLI Interface Structure and Output Formatting](docs/adr/0002-cli-interface-and-formatting.md)
  - [0003: Admin Elevation Detection and NPM Package Stack Selection](docs/adr/0003-admin-elevation-and-npm-stack.md)

---

## 📜 License

MIT © [shiddiqeuy](https://github.com/shiddiqeuy)
