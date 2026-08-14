#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

CREATE_PAYLOAD='{"filename":"syllabus.pdf","path":"/uploads/syllabus.pdf","mime_type":"application/pdf","size":102400}'
create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/files" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$CREATE_PAYLOAD")
http_code=$(echo "$create_resp" | tail -n1)
body=$(echo "$create_resp" | sed '$d')

echo "POST /files HTTP_STATUS:$http_code"
if [ "$http_code" -ne 201 ]; then
  echo "Create failed:" $body
  exit 1
fi
file_id=$(echo "$body" | python -c "import sys,json;print(json.load(sys.stdin)['data']['file']['file_id'])")

echo "Created file_id: $file_id"

# Cleanup
delete_resp=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/files/$file_id" -H "Authorization: Bearer $TOKEN")
http_code=$(echo "$delete_resp" | tail -n1)

echo "DELETE /files/$file_id HTTP_STATUS:$http_code"

echo "PASS: files"
