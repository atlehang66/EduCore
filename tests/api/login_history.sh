#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

get_resp=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/login-history" -H "Authorization: Bearer $TOKEN")
http_code=$(echo "$get_resp" | tail -n1)

if [ "$http_code" -ne 200 ]; then
  echo "GET login-history failed: HTTP $http_code"
  exit 1
fi

echo "PASS: login_history"
