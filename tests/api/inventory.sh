#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

CREATE_PAYLOAD='{"asset_id":1,"quantity":10,"condition_status":"good","location":"Store Room"}'
create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/inventory" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$CREATE_PAYLOAD")
http_code=$(echo "$create_resp" | tail -n1)
body=$(echo "$create_resp" | sed '$d')

echo "POST /inventory HTTP_STATUS:$http_code"
if [ "$http_code" -ne 201 ]; then
  echo "Create failed:" $body
  exit 1
fi

inv_id=$(echo "$body" | python -c "import sys,json;print(json.load(sys.stdin)['data']['inventory_item']['inventory_id'])")

echo "Created inventory_id: $inv_id"

# Cleanup
curl -s -X DELETE "$BASE_URL/inventory/$inv_id" -H "Authorization: Bearer $TOKEN" -w "\nHTTP_STATUS:%{http_code}\n"

echo "PASS: inventory"
