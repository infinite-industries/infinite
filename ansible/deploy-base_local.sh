#!/usr/bin/env bash

ansible-playbook --extra-vars "ansible_sudo_pass=xxx" -l local base_playbook.yml
