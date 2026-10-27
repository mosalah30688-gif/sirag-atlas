#!/usr/bin/env bash
# ==============================================================================
# Build Full Standalone Electron Linux AppImage:
# Output: dist/Sirag-Atlas-Seerah-x86_64.AppImage
# ==============================================================================
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "1/3 — Preparing offline web bundle (www/)..."
bash scripts/build-www.sh

echo "2/3 — Installing dependencies if needed..."
if [ ! -d "node_modules/electron" ]; then
  npm install
fi

echo "3/3 — Packaging standalone Linux AppImage via electron-builder..."
npx electron-builder --linux AppImage --x64

echo "✅ Done! Your standalone Linux AppImage is ready inside dist/:"
ls -lh dist/*.AppImage
