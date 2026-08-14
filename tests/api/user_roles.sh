#!/bin/bash

set -euo pipefail

BASE_URL="http://localhost:3000/api/v1"
TOKEN="<REPLACE_WITH_VALID_TOKEN>"

USER_ID=1
ROLE_ID=1

echo "Testing User-Roles API"

# GET roles for user
http_status=$(curl -s -o /dev/stderr -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE_URL/users/$USER_ID/roles")
if [ "$http_status" -eq 200 ]; then
  echo "GET /users/$USER_ID/roles -> PASS ($http_status)"
else
  echo "GET /users/$USER_ID/roles -> FAIL ($http_status)"
fi

# POST assign role
post_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$BASE_URL/users/$USER_ID/roles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role_id":'"$ROLE_ID"'}')

echo "$post_response"
post_status=$(echo "$post_response" | tr -d '\r' | sed -n '$p' | sed 's/HTTP_STATUS://')

if [ "$post_status" -eq 201 ]; then
  echo "POST assign role -> PASS ($post_status)"

  # GET to confirm
  curl -s -o /dev/stderr -w "\nHTTP_STATUS:%{http_code}\n" -H "Authorization: Bearer $TOKEN" "$BASE_URL/users/$USER_ID/roles"

  # DELETE
  del_status=$(curl -s -o /dev/stderr -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE_URL/users/$USER_ID/roles/$ROLE_ID")
  echo "DELETE status: $del_status"
else
  echo "POST assign role -> FAIL ($post_status)"
fi
