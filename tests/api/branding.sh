#!/bin/bash

set -euo pipefail

BASE_URL="http://localhost:3000/api/v1"
TOKEN="<REPLACE_WITH_VALID_TOKEN>"

echo "Testing Branding API"

# GET branding for school
http_status=$(curl -s -o /dev/stderr -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE_URL/branding")
if [ "$http_status" -eq 200 ]; then
  echo "GET /branding -> PASS ($http_status)"
else
  echo "GET /branding -> FAIL ($http_status)"
fi

# POST create branding
post_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$BASE_URL/branding" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"logo_url":"https://example.com/logo.png","favicon_url":"https://example.com/favicon.ico","theme_color":"#0d6efd","primary_font":"Inter","secondary_font":"Roboto" }')

echo "$post_response"
post_status=$(echo "$post_response" | tr -d '\r' | sed -n '$p' | sed 's/HTTP_STATUS://')

if [ "$post_status" -eq 201 ]; then
  echo "POST /branding -> PASS ($post_status)"
  created_id=$(echo "$post_response" | head -n -1 | sed -n 's/.*\"branding_id\":\s*\([0-9]*\).*/\1/p')
  if [ -z "$created_id" ] && command -v jq >/dev/null 2>&1; then
    created_id=$(echo "$post_response" | head -n -1 | jq -r '.data.branding.branding_id')
  fi

  echo "Created branding id: $created_id"

  # GET created
  curl -s -o /dev/stderr -w "\nHTTP_STATUS:%{http_code}\n" -H "Authorization: Bearer $TOKEN" "$BASE_URL/branding/$created_id"

  # PUT update
  put_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X PUT "$BASE_URL/branding/$created_id" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"theme_color":"#198754","primary_font":"Nunito" }')
  echo "$put_response"

  # DELETE
  del_status=$(curl -s -o /dev/stderr -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE_URL/branding/$created_id")
  echo "DELETE status: $del_status"
else
  echo "POST /branding -> FAIL ($post_status)"
fi
