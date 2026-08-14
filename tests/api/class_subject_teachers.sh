#!/bin/bash

set -euo pipefail

BASE_URL="http://localhost:3000/api/v1"
TOKEN="<REPLACE_WITH_VALID_TOKEN>"

CLASS_ID=1
SUBJECT_ID=1
TEACHER_ID=1

echo "Testing Class-Subject-Teachers API"

# GET teachers for class+subject
http_status=$(curl -s -o /dev/stderr -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE_URL/classes/$CLASS_ID/subjects/$SUBJECT_ID/teachers")
if [ "$http_status" -eq 200 ]; then
  echo "GET /classes/$CLASS_ID/subjects/$SUBJECT_ID/teachers -> PASS ($http_status)"
else
  echo "GET /classes/$CLASS_ID/subjects/$SUBJECT_ID/teachers -> FAIL ($http_status)"
fi

# POST assign teacher
post_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$BASE_URL/classes/$CLASS_ID/subjects/$SUBJECT_ID/teachers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"teacher_id':"$TEACHER_ID"', "is_primary": true }')

echo "$post_response"
post_status=$(echo "$post_response" | tr -d '\r' | sed -n '$p' | sed 's/HTTP_STATUS://')

if [ "$post_status" -eq 201 ]; then
  echo "POST assign -> PASS ($post_status)"
  created_teacher_id=$TEACHER_ID

  # GET single assignment via list
  curl -s -o /dev/stderr -w "\nHTTP_STATUS:%{http_code}\n" -H "Authorization: Bearer $TOKEN" "$BASE_URL/classes/$CLASS_ID/subjects/$SUBJECT_ID/teachers"

  # PUT update is_primary
  put_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X PUT "$BASE_URL/classes/$CLASS_ID/subjects/$SUBJECT_ID/teachers/$created_teacher_id" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"is_primary": false }')
  echo "$put_response"

  # DELETE
  del_status=$(curl -s -o /dev/stderr -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE_URL/classes/$CLASS_ID/subjects/$SUBJECT_ID/teachers/$created_teacher_id")
  echo "DELETE status: $del_status"
else
  echo "POST assign -> FAIL ($post_status)"
fi
