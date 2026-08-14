#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000/api/v1}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "TOKEN must be set. Export TOKEN=\"<JWT>\" before running."
  exit 2
fi

CREATE_PAYLOAD='{"title":"Introduction to Algorithms","author":"CLRS","isbn":"9780262033848","copies_available":3}'
create_resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/library-books" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$CREATE_PAYLOAD")
http_code=$(echo "$create_resp" | tail -n1)
body=$(echo "$create_resp" | sed '$d')

echo "POST /library-books HTTP_STATUS:$http_code"
if [ "$http_code" -ne 201 ]; then
  echo "Create failed:" $body
  exit 1
fi
book_id=$(echo "$body" | python -c "import sys,json;print(json.load(sys.stdin)['data']['book']['book_id'])")

echo "Created book_id: $book_id"

# Cleanup
curl -s -X DELETE "$BASE_URL/library-books/$book_id" -H "Authorization: Bearer $TOKEN" -w "\nHTTP_STATUS:%{http_code}\n"

echo "PASS: library_books"
