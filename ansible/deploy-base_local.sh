#!/usr/bin/env bash

INFINITE_DEPLOY_ENV='local' \
ansible-playbook --extra-vars "ansible_sudo_pass=xxx" ./base_playbook.yml
