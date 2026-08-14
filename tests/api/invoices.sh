#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

echo "Testing invoices..."

# Create (requires an existing student_id in DB)
# Update the student_id variable below to point to a valid student in your DB
student_id=${TEST_STUDENT_ID:-}
if [ -z "$student_id" ]; then
  echo "Set TEST_STUDENT_ID environment variable to a valid student_id for invoice creation test. Skipping create test." 
else
  CREATE_PAYLOAD=$(jq -n --arg s "$student_id" --argjson amt 100.0 '{student_id: ($s|tonumber), amount: $amt, status: "pending"}')
  create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/invoices" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$CREATE_PAYLOAD")
  http_code=$(echo "$create_resp" | tail -n1)
  body=$(echo "$create_resp" | sed '$d')
  echo "POST /invoices HTTP_STATUS:$http_code"
  if [ "$http_code" -ne 201 ]; then
    echo "Create failed:" $body
    exit 1
  fi
  invoice_id=$(echo "$body" | python -c "import sys,json;print(json.load(sys.stdin)['data']['invoice']['invoice_id'])")
  echo "Created invoice_id: $invoice_id"
fi

echo "PASS: invoices (create skipped if no TEST_STUDENT_ID)"
