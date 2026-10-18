#!/usr/bin/env bash

# This is a one off for creating the role we use to automate staging start/stop
# I'm preserving it here for information purposes. Most dev's will not need to worry
# about this

az role definition create --role-definition role.json
