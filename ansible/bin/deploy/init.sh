#!/usr/bin/env bash
# Do the initial software install & config for a host.
# shellcheck source=_common.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/_common.sh"

usage() { echo "Usage: $(basename "$0") [staging|prod] [ansible-playbook args...]"; }

parse_env "${1:-}"
if (($#)); then shift; fi

log "running initial setup for $env"
ansible-playbook -l "$env" "$@" base_playbook.yml
