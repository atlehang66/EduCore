#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TEST_JWT="${TEST_JWT:-${TOKEN:-}}"

if [ -z "$TEST_JWT" ]; then
  echo "TEST_JWT must be set. Export TEST_JWT=\"<JWT>\" before running."
  exit 2
fi

echo "Testing api_keys..."

# Random suffix so repeated runs don't collide on name uniqueness (currently none,
# but future-proofing). api_keys doesn't enforce a unique name today.
SUFFIX=$(date +%s)$RANDOM

# Create
CREATE_PAYLOAD="{\"name\":\"Test API Key $SUFFIX\",\"is_active\":true}"
create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api-keys" \
  -H "Authorization: Bearer $TEST_JWT" \
  -H "Content-Type: application/json" \
  -d "$CREATE_PAYLOAD")

http_code=$(echo "$create_resp" | tail -n1)
body=$(echo "$create_resp" | sed '$d')

echo "POST /api-keys HTTP_STATUS:$http_code"
if [ "$http_code" -ne 201 ]; then
  echo "Create failed:" $body
  exit 1
fi

# Extract ID
api_key_id=""
if command -v jq >/dev/null 2>&1; then
  api_key_id=$(echo "$body" | jq -r '.data.api_key.api_key_id')
else
  api_key_id=$(echo "$body" | python -c "import sys, json; print(json.load(sys.stdin)['data']['api_key']['api_key_id'])")
fi

if [ -z "$api_key_id" ] || [ "$api_key_id" = "null" ]; then
  echo "Failed to extract api_key_id from response"
  exit 1
fi

echo "Created api_key_id: $api_key_id"

# Get by ID
get_resp=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api-keys/$api_key_id" \
  -H "Authorization: Bearer $TEST_JWT")
http_code=$(echo "$get_resp" | tail -n1)
body=$(echo "$get_resp" | sed '$d')

echo "GET /api-keys/$api_key_id HTTP_STATUS:$http_code"
if [ "$http_code" -ne 200 ]; then
  echo "Get by ID failed:" $body
  exit 1
fi

# Update
UPDATE_PAYLOAD="{\"name\":\"Updated API Key $SUFFIX\",\"is_active\":false}"
update_resp=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/api-keys/$api_key_id" \
  -H "Authorization: Bearer $TEST_JWT" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_PAYLOAD")
http_code=$(echo "$update_resp" | tail -n1)
body=$(echo "$update_resp" | sed '$d')

echo "PUT /api-keys/$api_key_id HTTP_STATUS:$http_code"
if [ "$http_code" -ne 200 ]; then
  echo "Update failed:" $body
  exit 1
fi

# Delete
delete_resp=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/api-keys/$api_key_id" \
  -H "Authorization: Bearer $TEST_JWT")
http_code=$(echo "$delete_resp" | tail -n1)
body=$(echo "$delete_resp" | sed '$d')

echo "DELETE /api-keys/$api_key_id HTTP_STATUS:$http_code"
if [ "$http_code" -ne 200 ]; then
  echo "Delete failed:" $body
  exit 1
fi

# Confirm deletion
confirm_resp=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api-keys/$api_key_id" \
  -H "Authorization: Bearer $TEST_JWT")
http_code=$(echo "$confirm_resp" | tail -n1)

if [ "$http_code" -eq 404 ]; then
  echo "PASS: api_keys CRUD flow"
  exit 0
else
  echo "FAIL: Deleted resource still accessible, HTTP:$http_code"
  exit 1
fi