#!/usr/bin/env bash
# Build the GitHub Pages version and sync it into docs/.
# Pages is configured to serve the main branch /docs folder — no Actions needed.
set -euo pipefail
cd "$(dirname "$0")/.."

GITHUB_PAGES=1 npm run build

rm -rf docs
mkdir -p docs
cp -R out/. docs/
touch docs/.nojekyll

echo "docs/ ready — $(find docs -type f | wc -l | tr -d ' ') files"
