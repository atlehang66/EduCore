#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

# Create
echo "Testing payment_methods..."
CREATE_PAYLOAD='{"name":"Test Method","provider":"Stripe","details":"{}","is_active":true}'
create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/payment-methods" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$CREATE_PAYLOAD")

http_code=$(echo "$create_resp" | tail -n1)
body=$(echo "$create_resp" | sed '$d')

echo "POST /payment-methods HTTP_STATUS:$http_code"
if [ "$http_code" -ne 201 ]; then
  echo "Create failed:" $body
  exit 1
fi

# Extract ID
api_id=$(echo "$body" | python -c "import sys, json; print(json.load(sys.stdin)['data']['payment_method']['payment_method_id'])")
if [ -z "$api_id" ] || [ "$api_id" = "None" ]; then
  echo "Failed to extract ID"
  exit 1
fi

echo "Created payment_method_id: $api_id"

# Get
get_resp=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/payment-methods/$api_id" -H "Authorization: Bearer $TOKEN")
http_code=$(echo "$get_resp" | tail -n1)

echo "GET /payment-methods/$api_id HTTP_STATUS:$http_code"
if [ "$http_code" -ne 200 ]; then
  echo "Get failed"
  exit 1
fi

# Update
UPDATE_PAYLOAD='{"name":"Updated Method","is_active":false}'
update_resp=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/payment-methods/$api_id" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$UPDATE_PAYLOAD")
http_code=$(echo "$update_resp" | tail -n1)

echo "PUT /payment-methods/$api_id HTTP_STATUS:$http_code"
if [ "$http_code" -ne 200 ]; then
  echo "Update failed"
  exit 1
fi

# Delete
delete_resp=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/payment-methods/$api_id" -H "Authorization: Bearer $TOKEN")
http_code=$(echo "$delete_resp" | tail -n1)

echo "DELETE /payment-methods/$api_id HTTP_STATUS:$http_code"
if [ "$http_code" -ne 200 ]; then
  echo "Delete failed"
  exit 1
fi

echo "PASS: payment_methods"
