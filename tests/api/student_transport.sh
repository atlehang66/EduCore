#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

CREATE_PAYLOAD='{"student_id":1,"transport_id":1,"pickup_point":"Stop A","dropoff_point":"Stop B","active":true}'
create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/student-transport" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$CREATE_PAYLOAD")
http_code=$(echo "$create_resp" | tail -n1)
body=$(echo "$create_resp" | sed '$d')

echo "POST /student-transport HTTP_STATUS:$http_code"
if [ "$http_code" -ne 201 ]; then
  echo "Create failed:" $body
  exit 1
fi

st_id=$(echo "$body" | python -c "import sys,json;print(json.load(sys.stdin)['data']['student_transport']['student_transport_id'])")

echo "Created student_transport_id: $st_id"

# cleanup
curl -s -X DELETE "$BASE_URL/student-transport/$st_id" -H "Authorization: Bearer $TOKEN" -w "\nHTTP_STATUS:%{http_code}\n"

echo "PASS: student_transport"
