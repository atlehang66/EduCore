#!/bin/bash

set -euo pipefail

BASE_URL="http://localhost:3000/api/v1"
TOKEN="<REPLACE_WITH_VALID_TOKEN>"

echo "Testing Roles API"

# GET all
http_status=$(curl -s -o /dev/stderr -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE_URL/roles")
if [ "$http_status" -eq 200 ]; then
  echo "GET /roles -> PASS ($http_status)"
else
  echo "GET /roles -> FAIL ($http_status)"
fi

# POST create
post_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$BASE_URL/roles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Role","description":"Role for testing","is_system_role":false }')

echo "$post_response"
post_status=$(echo "$post_response" | tr -d '\r' | sed -n '$p' | sed 's/HTTP_STATUS://')

if [ "$post_status" -eq 201 ]; then
  echo "POST /roles -> PASS ($post_status)"
  created_id=$(echo "$post_response" | head -n -1 | sed -n 's/.*\"role_id\":\s*\([0-9]*\).*/\1/p')
  if [ -z "$created_id" ] && command -v jq >/dev/null 2>&1; then
    created_id=$(echo "$post_response" | head -n -1 | jq -r '.data.role.role_id')
  fi

  echo "Created role id: $created_id"

  # GET created
  curl -s -o /dev/stderr -w "\nHTTP_STATUS:%{http_code}\n" -H "Authorization: Bearer $TOKEN" "$BASE_URL/roles/$created_id"

  # PUT update
  put_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X PUT "$BASE_URL/roles/$created_id" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Role Updated","description":"Updated description" }')
  echo "$put_response"

  # DELETE
  del_status=$(curl -s -o /dev/stderr -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE_URL/roles/$created_id")
  echo "DELETE status: $del_status"
else
  echo "POST /roles -> FAIL ($post_status)"
fi
