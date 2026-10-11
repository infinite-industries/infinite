#!/usr/bin/env bash
# Perform a database backup.
# shellcheck source=_common.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/_common.sh"

usage() { echo "Usage: $(basename "$0") [staging|prod] [ansible-playbook args...]"; }

parse_env "${1:-}"
if (($#)); then shift; fi

log "backing up the database in $env"
ansible-playbook -l "$env" -t backup "$@" deploy_site_playbook.yml
