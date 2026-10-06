#!/usr/bin/env bash
# Deploy the site to an environment.
# shellcheck source=_common.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/_common.sh"

usage() { echo "Usage: $(basename "$0") [staging|prod] [ansible-playbook args...]"; }

parse_env "${1:-}"
if (($#)); then shift; fi

log "deploying to $env"
ansible-playbook -l "$env" "$@" deploy_site_playbook.yml
