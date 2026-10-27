#!/usr/bin/env bash
set -e
rm -rf www
mkdir -p www
cp index.html manifest.json version.json sw.js www/
cp -r css js assets www/
echo "Built www/ bundle (v1.2.0) for Android & Linux Desktop successfully."
