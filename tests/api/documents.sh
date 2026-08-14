#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

CREATE_PAYLOAD='{"title":"Staff Handbook","description":"Policy handbook","file_id":1}'
create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/documents" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$CREATE_PAYLOAD")
http_code=$(echo "$create_resp" | tail -n1)
body=$(echo "$create_resp" | sed '$d')

echo "POST /documents HTTP_STATUS:$http_code"
if [ "$http_code" -ne 201 ]; then
  echo "Create failed:" $body
  exit 1
fi

doc_id=$(echo "$body" | python -c "import sys,json;print(json.load(sys.stdin)['data']['document']['document_id'])")

echo "Created document_id: $doc_id"

# Cleanup
delete_resp=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/documents/$doc_id" -H "Authorization: Bearer $TOKEN")
http_code=$(echo "$delete_resp" | tail -n1)

echo "DELETE /documents/$doc_id HTTP_STATUS:$http_code"
if [ "$http_code" -ne 200 ]; then
  echo "Delete failed"
  exit 1
fi

echo "PASS: documents"
