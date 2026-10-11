#!/usr/bin/env bash

# Reports the staging VM power state (and the step summary in GitHub Actions).
# shellcheck source=_common.sh
source "$(dirname "${BASH_SOURCE[0]}")/_common.sh"

RESPONSE=$(azure_get instanceView)
POWER_STATUS=$(power_state <<< "$RESPONSE")

echo "Staging VM status: $POWER_STATUS"
echo "$RESPONSE" | jq .

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  {
    echo "### Staging VM status: $POWER_STATUS"
    echo
    echo "<details><summary>Full instanceView JSON</summary>"
    echo
    echo '```json'
    echo "$RESPONSE" | jq .
    echo '```'
    echo
    echo "</details>"
  } >> "$GITHUB_STEP_SUMMARY"
fi
