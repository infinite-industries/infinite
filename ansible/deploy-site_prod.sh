#!/usr/bin/env bash

INFINITE_DEPLOY_ENV='prod' \
INFINITE_IMAGE_VERSION_TAG='master' \
ansible-playbook ./deploy_site_playbook.yml
