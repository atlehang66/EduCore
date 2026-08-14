#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

# Requires TEST_BOOK_ID and TEST_STUDENT_ID env vars
book_id=${TEST_BOOK_ID:-}
student_id=${TEST_STUDENT_ID:-}
if [ -z "$book_id" ] || [ -z "$student_id" ]; then
  echo "Set TEST_BOOK_ID and TEST_STUDENT_ID to run loan create test. Skipping create."
else
  CREATE_PAYLOAD=$(jq -n --argjson b $book_id --argjson s $student_id '{book_id: $b, student_id: $s, loaned_at: "2026-08-01T00:00:00Z", due_at: "2026-08-15T00:00:00Z"}')
  create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/loans" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$CREATE_PAYLOAD")
  http_code=$(echo "$create_resp" | tail -n1)
  body=$(echo "$create_resp" | sed '$d')
  echo "POST /loans HTTP_STATUS:$http_code"
  if [ "$http_code" -ne 201 ]; then
    echo "Create failed:" $body
    exit 1
  fi
  loan_id=$(echo "$body" | python -c "import sys,json;print(json.load(sys.stdin)['data']['loan']['loan_id'])")
  echo "Created loan_id: $loan_id"
fi

echo "PASS: loans (create skipped if env vars not provided)"
