#!/bin/bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TEST_JWT="${TEST_JWT:-${TOKEN:-}}"

if [ -z "$TEST_JWT" ]; then
  echo "TEST_JWT must be set. Export TEST_JWT=\"<JWT>\" before running."
  exit 2
fi

# Required existing IDs - set via env if your seed uses different values
STUDENT_ID="${STUDENT_ID:-1}"
TERM_ID="${TERM_ID:-1}"

echo "Testing Report Cards API (student_id=$STUDENT_ID, term_id=$TERM_ID)"

auth_header=(-H "Authorization: Bearer $TEST_JWT")
json_header=(-H "Content-Type: application/json")

# GET all
get_all_body=$(mktemp)
http_status=$(curl -s -o "$get_all_body" -w "%{http_code}" "${auth_header[@]}" "$BASE_URL/report-cards")
if [ "$http_status" -eq 200 ]; then
  echo "GET /report-cards -> PASS ($http_status)"
else
  echo "GET /report-cards -> FAIL ($http_status)"
  cat "$get_all_body"
fi
rm -f "$get_all_body"

# POST
post_body=$(mktemp)
post_response=$(curl -s -o "$post_body" -w "%{http_code}" -X POST "$BASE_URL/report-cards" \
  "${auth_header[@]}" "${json_header[@]}" \
  -d "{\"student_id\":$STUDENT_ID,\"term_id\":$TERM_ID,\"overall_average\":85.5,\"class_rank\":3,\"teacher_comments\":\"Good work\",\"principal_comments\":null}")
post_status="$post_response"

echo "POST /report-cards -> $post_status"
cat "$post_body"

if [ "$post_status" -eq 201 ]; then
  echo "POST /report-cards -> PASS"
  if command -v jq >/dev/null 2>&1; then
    created_id=$(jq -r '.data.report_card.report_card_id' < "$post_body")
  else
    created_id=$(python -c "import sys, json; print(json.load(sys.stdin)['data']['report_card']['report_card_id'])" < "$post_body")
  fi
  echo "Created report_card id: $created_id"

  # GET created
  get_one_body=$(mktemp)
  get_status=$(curl -s -o "$get_one_body" -w "%{http_code}" "${auth_header[@]}" "$BASE_URL/report-cards/$created_id")
  echo "GET /report-cards/$created_id -> $get_status"
  cat "$get_one_body"
  rm -f "$get_one_body"

  # PUT update
  put_body=$(mktemp)
  put_status=$(curl -s -o "$put_body" -w "%{http_code}" -X PUT "$BASE_URL/report-cards/$created_id" \
    "${auth_header[@]}" "${json_header[@]}" \
    -d "{\"student_id\":$STUDENT_ID,\"term_id\":$TERM_ID,\"overall_average\":90,\"class_rank\":2,\"teacher_comments\":\"Improved\",\"principal_comments\":\"Well done\"}")
  echo "PUT /report-cards/$created_id -> $put_status"
  cat "$put_body"
  rm -f "$put_body"

  # DELETE
  del_body=$(mktemp)
  del_status=$(curl -s -o "$del_body" -w "%{http_code}" -X DELETE "${auth_header[@]}" "$BASE_URL/report-cards/$created_id")
  echo "DELETE /report-cards/$created_id -> $del_status"
  cat "$del_body"
  rm -f "$del_body"
else
  echo "POST /report-cards -> FAIL ($post_status)"
fi
rm -f "$post_body"