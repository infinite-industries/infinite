#!/usr/bin/env bash

INFINITE_DEPLOY_ENV='staging' \
INFINITE_IMAGE_VERSION_TAG='development' \
ansible-playbook ./deploy_site_playbook.yml
