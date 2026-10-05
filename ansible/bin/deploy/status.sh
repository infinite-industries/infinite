#!/usr/bin/env bash
# Query the status of services for an environment.
# shellcheck source=_common.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/_common.sh"

usage() { echo "Usage: $(basename "$0") [staging|prod] [ansible args...]"; }

parse_env "${1:-}"
if (($#)); then shift; fi

log "checking nginx and infinite services in $env"
ansible -b -m command -a 'systemctl status nginx infinite' "$@" "$env"
