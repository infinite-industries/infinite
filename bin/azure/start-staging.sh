#!/usr/bin/env bash

# Starts the staging VM and waits until Azure reports it as running.
# Safe to run when the VM is already running.
# shellcheck source=_common.sh
source "$(dirname "${BASH_SOURCE[0]}")/_common.sh"

azure_post start

for _ in $(seq 1 60); do
  POWER_STATUS=$(azure_get instanceView | power_state)
  echo "Staging VM status: $POWER_STATUS"
  if [[ "$POWER_STATUS" == "VM running" ]]; then
    exit 0
  fi
  sleep 5
done

echo "Timed out waiting for staging VM to start" >&2
exit 1
