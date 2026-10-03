#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-.env.ci}"

if [[ ! -f "$ENV_FILE" ]]; then
  printf 'Environment file does not exist: %s\n' "$ENV_FILE" >&2
  exit 1
fi

kubectl create secret generic mv-admin-env \
  --namespace=prod \
  --from-env-file="$ENV_FILE" \
  --dry-run=client \
  -o yaml | kubectl apply -f -
