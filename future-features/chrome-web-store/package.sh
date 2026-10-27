#!/bin/sh
# Zips extension/ into dist/ for uploading to the Chrome Web Store.
# Usage: sh future-features/chrome-web-store/package.sh
set -e
cd "$(dirname "$0")/../.."
version=$(node -p "require('./extension/manifest.json').version")
out="dist/legacy-spell-updater-$version.zip"
mkdir -p dist
rm -f "$out"
(cd extension && zip -qr "../$out" . -x '.*')
echo "$out"
