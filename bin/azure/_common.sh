# Sourced by the scripts in bin/azure. Not meant to be run directly.
# Non-secret values are read from config.env.
# The secret value AZURE_START_STOP_CLIENT_SECRET must be set on the environment.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=config.env
source "$SCRIPT_DIR/config.env"

: "${AZURE_START_STOP_CLIENT_SECRET:?AZURE_START_STOP_CLIENT_SECRET is not set}"

TOKEN=$(curl -fsS -X POST \
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

azure_get()  { curl -fsS -H "Authorization: Bearer $TOKEN" "$BASE/$1?api-version=$API_VERSION"; }
azure_post() { curl -fsS -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Length: 0" "$BASE/$1?api-version=$API_VERSION"; }

# Reads an instanceView response on stdin and prints e.g. "VM running" or "VM deallocated".
power_state() {
  jq -r '.statuses[] | select(.code | startswith("PowerState/")) | .displayStatus'
}
