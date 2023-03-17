#!/usr/bin/env bash

# This is used for deploying to local vms for testing

ansible-playbook -l local ./deploy_site_playbook.yml

