#!/usr/bin/env bash

INFINITE_DEPLOY_ENV='prod' \
ansible-playbook ./deploy_site_playbook.yml
