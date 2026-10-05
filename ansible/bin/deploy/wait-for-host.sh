#!/usr/bin/env bash
# Wait until hosts in an environment accept ssh connections.
# shellcheck source=_common.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/_common.sh"

usage() { echo "Usage: $(basename "$0") [staging|prod] [ansible args...]"; }

parse_env "${1:-}"
if (($#)); then shift; fi

log "waiting for ssh on $env"
ansible -m wait_for_connection -a 'timeout=300' "$@" "$env"
