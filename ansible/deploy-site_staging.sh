#!/usr/bin/env bash

INFINITE_DEPLOY_ENV='staging' \
ansible-playbook ./deploy_site_playbook.yml
