#!/usr/bin/env bash
# Restart services for an environment, then report their status.
# shellcheck source=_common.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/_common.sh"

usage() { echo "Usage: $(basename "$0") [staging|prod] [ansible args...]"; }

parse_env "${1:-}"
if (($#)); then shift; fi

for service in nginx infinite; do
  log "restarting $service service in $env..."
  ansible -b -m service -a "name=$service state=restarted" "$@" "$env"
  log "restarting $service service in $env... done"
done

"$SCRIPT_DIR/status.sh" "$env" "$@"
