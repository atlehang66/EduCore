#!/bin/bash

set -euo pipefail

BASE_URL="http://localhost:3000/api/v1"
TOKEN="<REPLACE_WITH_VALID_TOKEN>"

echo "Testing Permissions API"

# GET all
http_status=$(curl -s -o /dev/stderr -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE_URL/permissions")
if [ "$http_status" -eq 200 ]; then
  echo "GET /permissions -> PASS ($http_status)"
else
  echo "GET /permissions -> FAIL ($http_status)"
fi

# POST create
post_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$BASE_URL/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"test.permission","module":"testing","description":"Permission for testing" }')

echo "$post_response"
post_status=$(echo "$post_response" | tr -d '\r' | sed -n '$p' | sed 's/HTTP_STATUS://')

if [ "$post_status" -eq 201 ]; then
  echo "POST /permissions -> PASS ($post_status)"
  created_id=$(echo "$post_response" | head -n -1 | sed -n 's/.*\"permission_id\":\s*\([0-9]*\).*/\1/p')
  if [ -z "$created_id" ] && command -v jq >/dev/null 2>&1; then
    created_id=$(echo "$post_response" | head -n -1 | jq -r '.data.permission.permission_id')
  fi

  echo "Created permission id: $created_id"

  # GET created
  curl -s -o /dev/stderr -w "\nHTTP_STATUS:%{http_code}\n" -H "Authorization: Bearer $TOKEN" "$BASE_URL/permissions/$created_id"

  # PUT update
  put_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X PUT "$BASE_URL/permissions/$created_id" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"code":"test.permission.updated","module":"testing","description":"Updated" }')
  echo "$put_response"

  # DELETE
  del_status=$(curl -s -o /dev/stderr -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE_URL/permissions/$created_id")
  echo "DELETE status: $del_status"
else
  echo "POST /permissions -> FAIL ($post_status)"
fi
