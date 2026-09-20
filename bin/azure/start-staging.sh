TOKEN=$(curl -s -X POST \
          "https://login.microsoftonline.com/d9db15e7-0363-4724-8428-230195469d8e/oauth2/v2.0/token" \
          --data-urlencode "client_id=e2b699b8-367e-4ff4-b0d4-86c7068df10f" \
          --data-urlencode "client_secret=$ASURE_START_STOP_CLIENT_SECRET" \
          --data-urlencode "scope=https://management.azure.com/.default" \
          --data-urlencode "grant_type=client_credentials" | jq -r .access_token)

BASE="https://management.azure.com/subscriptions/27a2932a-f7b5-48a8-9453-2d296e239296/resourceGroups/STAGING/providers/Microsoft.Compute/virtualMachines/staging-vm-v3"

# Start
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Length: 0" "$BASE/start?api-version=2024-07-01"
