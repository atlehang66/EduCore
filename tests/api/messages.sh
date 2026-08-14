#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

CREATE_PAYLOAD='{"recipient_id":1,"subject":"Test","body":"Hello"}'
create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/messages" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$CREATE_PAYLOAD")
http_code=$(echo "$create_resp" | tail -n1)
body=$(echo "$create_resp" | sed '$d')

echo "POST /messages HTTP_STATUS:$http_code"
if [ "$http_code" -ne 201 ]; then
  echo "Create failed:" $body
  exit 1
fi
msg_id=$(echo "$body" | python -c "import sys,json;print(json.load(sys.stdin)['data']['message']['message_id'])")

echo "Created message_id: $msg_id"

# mark read
curl -s -X POST "$BASE_URL/messages/$msg_id/read" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{}' -w "\nHTTP_STATUS:%{http_code}\n"

# cleanup
curl -s -X DELETE "$BASE_URL/messages/$msg_id" -H "Authorization: Bearer $TOKEN" -w "\nHTTP_STATUS:%{http_code}\n"

echo "PASS: messages"
