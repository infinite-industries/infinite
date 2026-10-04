#!/usr/bin/env bash
# Cache the passphrase used to decrypt ansible-vault files in ansible/.password.
# shellcheck source=_common.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/_common.sh"

usage() { echo "Usage: $(basename "$0")"; }

case "${1:-}" in
  -h|--help) usage; exit 0 ;;
  "") ;;
  *) usage >&2; exit 1 ;;
esac

[[ -t 0 ]] || die "stdin is not a terminal; in CI, write the passphrase to .password or set ANSIBLE_VAULT_PASSWORD_FILE"

read -rsp "Ansible Vault Passphrase: " pass
printf '\n'

umask 077
printf '%s\n' "$pass" > "$ANSIBLE_DIR/.password"
chmod 600 "$ANSIBLE_DIR/.password"
log "wrote $ANSIBLE_DIR/.password"
