#!/bin/bash

set -euo pipefail

BASE_URL="http://localhost:3000/api/v1"
TOKEN="<REPLACE_WITH_VALID_TOKEN>"

echo "Testing Attendance Sessions API"

# GET all
http_status=$(curl -s -o /dev/stderr -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE_URL/attendance-sessions")
if [ "$http_status" -eq 200 ]; then
  echo "GET /attendance-sessions -> PASS ($http_status)"
else
  echo "GET /attendance-sessions -> FAIL ($http_status)"
fi

# Try to POST a new session. Requires existing class and teacher ids.
# Update these IDs to match local DB test data before running the script.
CLASS_ID=1
TEACHER_ID=1
SUBJECT_ID=1
SESSION_DATE="2026-01-15"
PERIOD="morning"

post_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$BASE_URL/attendance-sessions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"class_id":'"$CLASS_ID"', "teacher_id":'"$TEACHER_ID"', "subject_id":'"$SUBJECT_ID"', "session_date":"'"$SESSION_DATE"'", "period":"'"$PERIOD"'"}')

echo "$post_response"

# Capture HTTP status
post_status=$(echo "$post_response" | tr -d '\r' | sed -n '$p' | sed 's/HTTP_STATUS://')

if [ "$post_status" -eq 201 ]; then
  echo "POST /attendance-sessions -> PASS ($post_status)"
  created_id=$(echo "$post_response" | head -n -1 | sed -n 's/.*"session_id":\s*\([0-9]*\).*/\1/p' | tr -d '\r')
  # Fallback: parse JSON with jq if available
  if [ -z "$created_id" ] && command -v jq >/dev/null 2>&1; then
    created_id=$(echo "$post_response" | head -n -1 | jq -r '.data.session.session_id')
  fi

  echo "Created session id: $created_id"

  # GET created
  curl -s -o /dev/stderr -w "\nHTTP_STATUS:%{http_code}\n" -H "Authorization: Bearer $TOKEN" "$BASE_URL/attendance-sessions/$created_id"

  # PUT update
  updated_period="afternoon"
  put_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X PUT "$BASE_URL/attendance-sessions/$created_id" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"class_id":'"$CLASS_ID"', "teacher_id":'"$TEACHER_ID"', "subject_id":'"$SUBJECT_ID"', "session_date":"'"$SESSION_DATE"'", "period":"'"$updated_period"'"}')
  echo "$put_response"

  # DELETE
  del_status=$(curl -s -o /dev/stderr -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE_URL/attendance-sessions/$created_id")
  echo "DELETE status: $del_status"
else
  echo "POST /attendance-sessions -> FAIL ($post_status)"
fi
