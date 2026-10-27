#!/usr/bin/env bash
set -e
rm -rf www
mkdir -p www
cp index.html manifest.json version.json sw.js www/
cp -r css js assets www/
echo "Built www/ bundle (v1.1.0) for Capacitor Android successfully."
