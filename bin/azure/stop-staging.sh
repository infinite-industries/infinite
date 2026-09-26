#!/usr/bin/env bash

set -euo pipefail

# Non-secret values read from config.env
# The secret value AZURE_START_STOP_CLIENT_SECRET must be set on the environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.env"

TOKEN=$(curl -s -X POST \
          "https://login.microsoftonline.com/$TENANT_ID/oauth2/v2.0/token" \
          --data-urlencode "client_id=$CLIENT_ID" \
          --data-urlencode "client_secret=$AZURE_START_STOP_CLIENT_SECRET" \
          --data-urlencode "scope=https://management.azure.com/.default" \
          --data-urlencode "grant_type=client_credentials" | jq -r .access_token)

if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
  echo "Failed to obtain Azure access token" >&2
  exit 1
fi

BASE="https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Compute/virtualMachines/$VM_NAME"

# Stop (deallocate)
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Length: 0" "$BASE/deallocate?api-version=$API_VERSION"
