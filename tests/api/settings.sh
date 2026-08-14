#!/bin/bash

set -euo pipefail

BASE_URL="http://localhost:3000/api/v1"
TOKEN="<REPLACE_WITH_VALID_TOKEN>"

echo "Testing Settings API"

# GET all
http_status=$(curl -s -o /dev/stderr -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE_URL/settings")
if [ "$http_status" -eq 200 ]; then
  echo "GET /settings -> PASS ($http_status)"
else
  echo "GET /settings -> FAIL ($http_status)"
fi

# POST create
post_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$BASE_URL/settings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"site_name","value":"EduCore Test","description":"Site display name" }')

echo "$post_response"
post_status=$(echo "$post_response" | tr -d '\r' | sed -n '$p' | sed 's/HTTP_STATUS://')

if [ "$post_status" -eq 201 ]; then
  echo "POST /settings -> PASS ($post_status)"
  created_id=$(echo "$post_response" | head -n -1 | sed -n 's/.*\"setting_id\":\s*\([0-9]*\).*/\1/p')
  if [ -z "$created_id" ] && command -v jq >/dev/null 2>&1; then
    created_id=$(echo "$post_response" | head -n -1 | jq -r '.data.setting.setting_id')
  fi

  echo "Created setting id: $created_id"

  # GET created
  curl -s -o /dev/stderr -w "\nHTTP_STATUS:%{http_code}\n" -H "Authorization: Bearer $TOKEN" "$BASE_URL/settings/$created_id"

  # PUT update
  put_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X PUT "$BASE_URL/settings/$created_id" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"key":"site_name","value":"EduCore Updated","description":"Updated name" }')
  echo "$put_response"

  # DELETE
  del_status=$(curl -s -o /dev/stderr -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE_URL/settings/$created_id")
  echo "DELETE status: $del_status"
else
  echo "POST /settings -> FAIL ($post_status)"
fi
