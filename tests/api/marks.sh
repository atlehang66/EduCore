#!/bin/bash

set -euo pipefail

BASE_URL="http://localhost:3000/api/v1"
TOKEN="<REPLACE_WITH_VALID_TOKEN>"

# Discover exam and student
exam_json=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/exams")
student_json=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/students")

EXAM_ID=$(echo "$exam_json" | sed -n 's/.*"exam_id": *\([0-9]*\).*/\1/p' | head -n1)
STUDENT_ID=$(echo "$student_json" | sed -n 's/.*"student_id": *\([0-9]*\).*/\1/p' | head -n1)

if [ -z "$EXAM_ID" ] || [ -z "$STUDENT_ID" ]; then
  echo "No exam or student found; aborting"
  exit 0
fi

# Create mark
SCORE=85
MAX_SCORE=100

post_resp=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$BASE_URL/marks" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"student_id":'"$STUDENT_ID"', "exam_id":'"$EXAM_ID"', "score":'"$SCORE"', "max_score":'"$MAX_SCORE"'}')

echo "$post_resp"
status=$(echo "$post_resp" | tr -d '\r' | sed -n '$p' | sed 's/HTTP_STATUS://')
if [ "$status" -ne 201 ]; then
  echo "POST /marks failed: $status"
  exit 1
fi

created_id=$(echo "$post_resp" | head -n -1 | sed -n 's/.*"mark_id": *\([0-9]*\).*/\1/p')
if [ -z "$created_id" ]; then
  echo "Could not extract created mark id"
  exit 1
fi

echo "Created mark id: $created_id"

# GET created
curl -s -o /dev/stderr -w "\nHTTP_STATUS:%{http_code}\n" -H "Authorization: Bearer $TOKEN" "$BASE_URL/marks/$created_id"

# PUT update
put_resp=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X PUT "$BASE_URL/marks/$created_id" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"student_id":'"$STUDENT_ID"', "exam_id":'"$EXAM_ID"', "score":90, "max_score":'"$MAX_SCORE"'}')

echo "$put_resp"

# DELETE
del_status=$(curl -s -o /dev/stderr -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE_URL/marks/$created_id")
echo "DELETE status: $del_status"
