#!/bin/bash

set -euo pipefail

BASE_URL="http://localhost:3000/api/v1"
TOKEN="<REPLACE_WITH_VALID_TOKEN>"

headers=( -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" )

echo "Testing Exams API"

# Discover a class and subject
class_json=$(curl -s ${headers[0]} "$BASE_URL/classes")
subject_json=$(curl -s ${headers[0]} "$BASE_URL/subjects")

CLASS_ID=$(echo "$class_json" | sed -n 's/.*"class_id": *\([0-9]*\).*/\1/p' | head -n1)
SUBJECT_ID=$(echo "$subject_json" | sed -n 's/.*"subject_id": *\([0-9]*\).*/\1/p' | head -n1)

if [ -z "$CLASS_ID" ] || [ -z "$SUBJECT_ID" ]; then
  echo "No class or subject found; aborting tests"
  exit 0
fi

NAME="Unit Test Exam"
EXAM_DATE="2026-09-01"

# POST create
post_resp=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$BASE_URL/exams" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"subject_id':"'$SUBJECT_ID'", "class_id":'"$CLASS_ID"', "name":"'$NAME'", "exam_date":"'$EXAM_DATE'", "max_score":100}')

echo "$post_resp"
status=$(echo "$post_resp" | tr -d '\r' | sed -n '$p' | sed 's/HTTP_STATUS://')
if [ "$status" -ne 201 ]; then
  echo "POST /exams failed: $status"
  exit 1
fi

# extract created id
created_id=$(echo "$post_resp" | head -n -1 | sed -n 's/.*"exam_id": *\([0-9]*\).*/\1/p')
if [ -z "$created_id" ]; then
  echo "Could not extract created exam id"
  exit 1
fi

echo "Created exam id: $created_id"

# GET created
curl -s -o /dev/stderr -w "\nHTTP_STATUS:%{http_code}\n" -H "Authorization: Bearer $TOKEN" "$BASE_URL/exams/$created_id"

# PUT update
put_resp=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X PUT "$BASE_URL/exams/$created_id" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"subject_id':"'$SUBJECT_ID'", "class_id":'"$CLASS_ID"', "name":"Updated Exam", "exam_date":"'$EXAM_DATE'", "max_score":90}')

echo "$put_resp"

# DELETE
del_status=$(curl -s -o /dev/stderr -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE_URL/exams/$created_id")
echo "DELETE status: $del_status"
