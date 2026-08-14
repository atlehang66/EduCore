#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

CREATE_PAYLOAD='{"name":"School Shuttle","vehicle_no":"ABC-102","capacity":40,"driver_id":1,"route":"Downtown Loop","active":true}'
create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/transports" -H "Authorization: ******" -H "Content-Type: application/json" -d "$CREATE_PAYLOAD")
http_code=$(echo "$create_resp" | tail -n1)
body=$(echo "$create_resp" | sed '$d')

echo "POST /transports HTTP_STATUS:$http_code"
if [ "$http_code" -ne 201 ]; then
  echo "Create failed:" $body
  exit 1
fi

transport_id=$(echo "$body" | python -c "import sys,json;print(json.load(sys.stdin)['data']['transport']['transport_id'])")

echo "Created transport_id: $transport_id"

curl -s -X DELETE "$BASE_URL/transports/$transport_id" -H "Authorization: ******" -w "\nHTTP_STATUS:%{http_code}\n"

echo "PASS: transports"
