#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

while IFS= read -r -d '' file; do
    node --input-type=module --check < "$file"
done < <(find home -type f -name '*.js' -print0)

python3 - <<'PY'
from pathlib import Path
import xml.etree.ElementTree as ET

root = ET.parse("sitemap.xml").getroot()
namespace = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
if root.tag != namespace + "urlset":
    raise SystemExit("Invalid sitemap: expected a sitemap urlset element.")
locations = root.findall(f"{namespace}url/{namespace}loc")
if not locations or any(not (location.text or "").strip() for location in locations):
    raise SystemExit("Invalid sitemap: each URL must contain a location.")
for required in ("home.html", ".htaccess", "home/body.js", "home/styles/home-styles.css"):
    if not Path(required).is_file():
        raise SystemExit(f"Missing website file: {required}")
print("Website files and sitemap checks passed.")
PY

git diff --check
printf 'JavaScript syntax and whitespace checks passed.\n'
