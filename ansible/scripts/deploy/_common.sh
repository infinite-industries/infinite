# Sourced by every script in ansible/scripts/deploy. Not meant to be run directly.
#
# Every script runs from the ansible/ directory regardless of where
# it was invoked from, so ansible.cfg, the inventory, .password and the
# playbooks all resolve correctly.

set -euo pipefail

# shellcheck disable=SC2034
INVOCATION_DIR="$PWD"
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ANSIBLE_DIR="$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)"
cd "$ANSIBLE_DIR"

log() { printf '[%s] %s\n' "$(basename "$0" .sh)" "$*" >&2; }
die() { log "error: $*"; exit 1; }

# Sets $env from the first argument (default staging) and validates it.
# Callers must define usage().
parse_env() {
  env="${1:-staging}"
  case "$env" in
    staging|prod|local) ;;
    -h|--help) usage; exit 0 ;;
    *) die "unknown environment '$env' (expected staging|prod|local)" ;;
  esac
}
