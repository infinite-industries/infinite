#!/usr/bin/env bash

# This is used for deploying to local vms for testing

INFINITE_DEPLOY_ENV='local' \
INFINITE_IMAGE_VERSION_TAG='development' \
ansible-playbook --extra-vars "ansible_sudo_pass=xxx" ./deploy_site_playbook.yml
