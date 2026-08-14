#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

echo "Testing discounts..."
CREATE_PAYLOAD='{"name":"BackToSchool","type":"percentage","percentage":10,"is_active":true}'
create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/discounts" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$CREATE_PAYLOAD")

http_code=$(echo "$create_resp" | tail -n1)
body=$(echo "$create_resp" | sed '$d')

echo "POST /discounts HTTP_STATUS:$http_code"
if [ "$http_code" -ne 201 ]; then
  echo "Create failed:" $body
  exit 1
fi

discount_id=$(echo "$body" | python -c "import sys,json;print(json.load(sys.stdin)['data']['discount']['discount_id'])")
if [ -z "$discount_id" ] || [ "$discount_id" = "None" ]; then
  echo "Failed to extract discount_id"
  exit 1
fi

echo "Created discount_id: $discount_id"

# Get
get_resp=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/discounts/$discount_id" -H "Authorization: Bearer $TOKEN")
http_code=$(echo "$get_resp" | tail -n1)

echo "GET /discounts/$discount_id HTTP_STATUS:$http_code"
if [ "$http_code" -ne 200 ]; then
  echo "Get failed"
  exit 1
fi

# Update
UPDATE_PAYLOAD='{"name":"BackToSchool2026","percentage":15}'
update_resp=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/discounts/$discount_id" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$UPDATE_PAYLOAD")
http_code=$(echo "$update_resp" | tail -n1)

echo "PUT /discounts/$discount_id HTTP_STATUS:$http_code"
if [ "$http_code" -ne 200 ]; then
  echo "Update failed"
  exit 1
fi

# Delete
delete_resp=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/discounts/$discount_id" -H "Authorization: Bearer $TOKEN")
http_code=$(echo "$delete_resp" | tail -n1)

echo "DELETE /discounts/$discount_id HTTP_STATUS:$http_code"
if [ "$http_code" -ne 200 ]; then
  echo "Delete failed"
  exit 1
fi

echo "PASS: discounts"
