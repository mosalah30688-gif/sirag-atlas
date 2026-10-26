#!/usr/bin/env bash
set -e
rm -rf www
mkdir -p www
cp index.html manifest.json sw.js www/
cp -r css js assets www/
echo "Built www/ bundle for Capacitor Android successfully."
