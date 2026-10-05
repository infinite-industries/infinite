#!/usr/bin/env bash
# Pull the (correct) updated docker image(s).
# shellcheck source=_common.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/_common.sh"

usage() { echo "Usage: $(basename "$0") [staging|prod] [ansible args...]"; }

parse_env "${1:-}"
if (($#)); then shift; fi

log "pulling docker images in $env"
ansible -m command -a 'chdir=~/docker-files docker-compose pull' "$@" "$env"
