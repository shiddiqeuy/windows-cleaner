# Windows Cleaner CLI 🧹

A high-performance CLI disk cleanup application for Windows built with Node.js v24 & TypeScript.

## 🚀 Features

- **Multi-Category Scanning**: Cleans User Temp, System Temp, Windows Prefetch, Windows Update Cache (`SoftwareDistribution\Download`), Log Files, Crash Dumps, and Thumbnail Caches.
- **Fast Execution**: Non-blocking asynchronous filesystem traversal.
- **Safety First**:
  - `--min-age` filter (default `24h`) avoids deleting active session files.
  - Locked and in-use files are skipped safely without crashing.
  - `--dry-run` mode to preview reclaimable space before actual deletion.
- **Rich Terminal UI & Scripting Support**:
  - Interactive colored tables with status indicators.
  - Machine-readable `--json` output format for script automation.
- **Admin Privilege Detection**: Automatically detects user mode vs Administrator mode with clear guidance.

---

## 🛠️ Installation & Build

```bash
# Install dependencies
npm install

# Build TypeScript project
npm run build
```

---

## 💻 Usage

### 1. Scan Reclaimable Disk Space
```bash
# Run scan with interactive terminal table
npm run scan

# Scan specific categories
npx tsx src/index.ts scan --category temp,logs

# Filter by file age (e.g., files older than 7 days)
npx tsx src/index.ts scan --min-age 7d

# Output scan results in JSON
npx tsx src/index.ts scan --json
```

### 2. Preview Cleanup (Dry-Run)
```bash
# Preview files to be deleted without removing them
npx tsx src/index.ts clean --dry-run
```

### 3. Execute Cleanup
```bash
# Clean with interactive confirmation prompt
npm run clean

# Clean without prompt (skip confirmation)
npx tsx src/index.ts clean --yes
```

---

## 📄 Documentation

- [AGENTS.md](AGENTS.md) - Agent skills configuration
- [GLOSSARY.md](GLOSSARY.md) - Domain glossary & terminology definitions
- [docs/adr/](docs/adr/) - Architectural Decision Records (ADRs)

---

## 📜 License

MIT © [shiddiqeuy](https://github.com/shiddiqeuy)
