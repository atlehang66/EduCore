#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

echo "Testing assets..."
CREATE_PAYLOAD='{"name":"Projector","description":"LED Projector","value":1200,"location":"Library","status":"active"}'
create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/assets" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$CREATE_PAYLOAD")
http_code=$(echo "$create_resp" | tail -n1)
body=$(echo "$create_resp" | sed '$d')

echo "POST /assets HTTP_STATUS:$http_code"
if [ "$http_code" -ne 201 ]; then
  echo "Create failed:" $body
  exit 1
fi
asset_id=$(echo "$body" | python -c "import sys,json;print(json.load(sys.stdin)['data']['asset']['asset_id'])")

echo "Created asset_id: $asset_id"

# Cleanup: Delete created asset
curl -s -X DELETE "$BASE_URL/assets/$asset_id" -H "Authorization: Bearer $TOKEN" -w "\nHTTP_STATUS:%{http_code}\n"

echo "PASS: assets"
