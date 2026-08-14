#!/bin/bash

set -euo pipefail

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Running API test scripts in $BASE_DIR"

shopt -s nullglob
SCRIPTS=("$BASE_DIR"/*.sh)

for script in "${SCRIPTS[@]}"; do
  # skip this runner
  if [[ "$script" == "$BASE_DIR/run-all.sh" ]]; then
    continue
  fi

  printf "\n=== Running %s ===\n" "$script"
  bash "$script" || {
    echo "Script $script failed"
  }

done

printf "\nAll test scripts executed.\n"