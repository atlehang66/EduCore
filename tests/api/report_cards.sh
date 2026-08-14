#!/bin/bash

set -euo pipefail

BASE_URL="http://localhost:3000/api/v1"
TOKEN="<REPLACE_WITH_VALID_TOKEN>"

echo "Testing Report Cards API"

# GET all
http_status=$(curl -s -o /dev/stderr -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE_URL/report-cards")
if [ "$http_status" -eq 200 ]; then
  echo "GET /report-cards -> PASS ($http_status)"
else
  echo "GET /report-cards -> FAIL ($http_status)"
fi

# Required existing IDs
STUDENT_ID=1
TERM_ID=1

# POST
post_response=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "$BASE_URL/report-cards" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"student_id":