#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

# Payments tests
# Requires an existing invoice_id and payment_method_id (use TEST_INVOICE_ID and TEST_PAYMENT_METHOD_ID env vars)

invoice_id=${TEST_INVOICE_ID:-}
payment_method_id=${TEST_PAYMENT_METHOD_ID:-}

if [ -z "$invoice_id" ] || [ -z "$payment_method_id" ]; then
  echo "Set TEST_INVOICE_ID and TEST_PAYMENT_METHOD_ID to run full payment create test. Skipping create."
else
  echo "Testing payments create..."
  CREATE_PAYLOAD=$(jq -n --argjson inv $invoice_id --argjson pm $payment_method_id --argjson amt 50.0 '{invoice_id: $inv, payment_method_id: $pm, amount: $amt, reference: "TESTREF"}')
  create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/payments" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$CREATE_PAYLOAD")
  http_code=$(echo "$create_resp" | tail -n1)
  body=$(echo "$create_resp" | sed '$d')
  echo "POST /payments HTTP_STATUS:$http_code"
  if [ "$http_code" -ne 201 ]; then
    echo "Create failed:" $body
    exit 1
  fi
  payment_id=$(echo "$body" | python -c "import sys,json;print(json.load(sys.stdin)['data']['payment']['payment_id'])")
  echo "Created payment_id: $payment_id"
fi

echo "PASS: payments (create skipped if env vars not provided)"
