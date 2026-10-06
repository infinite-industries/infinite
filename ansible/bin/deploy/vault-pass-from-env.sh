#!/usr/bin/env bash
# Executable vault password file: ansible runs it and reads the passphrase from stdout.
printf '%s\n' "${ANSIBLE_VAULT_PASSWORD:?ANSIBLE_VAULT_PASSWORD is not set}"
