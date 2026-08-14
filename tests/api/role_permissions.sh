#!/bin/bash

set -euo pipefail

BASE_URL="http://localhost:3000/api/v1"
TOKEN="<REPLACE_WITH_VALID_TOKEN>"

ROLE_ID=1
PERMISSION_ID=1

echo "Testing Role-Permissions API"

# GET permissions for role
http_status=$(curl -s -o /dev/stderr -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE_URL/roles/$ROLE_ID/permissions")
if [ "$http_status" -eq 200 ]; then
  echo "GET /roles/$ROLE_ID/permissions -> PASS ($http_status)"
else
  echo "GET /roles/$ROLE_ID/permissions -> FAIL ($http_status)"
fi

# POST assign permission
post_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$BASE_URL/roles/$ROLE_ID/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"permission_id":'"$PERMISSION_ID"'}')

echo "$post_response"
post_status=$(echo "$post_response" | tr -d '\r' | sed -n '$p' | sed 's/HTTP_STATUS://')

if [ "$post_status" -eq 201 ]; then
  echo "POST assign permission -> PASS ($post_status)"

  # GET to confirm
  curl -s -o /dev/stderr -w "\nHTTP_STATUS:%{http_code}\n" -H "Authorization: Bearer $TOKEN" "$BASE_URL/roles/$ROLE_ID/permissions"

  # DELETE
  del_status=$(curl -s -o /dev/stderr -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE_URL/roles/$ROLE_ID/permissions/$PERMISSION_ID")
  echo "DELETE status: $del_status"
else
  echo "POST assign permission -> FAIL ($post_status)"
fi
