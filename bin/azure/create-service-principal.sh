#!/usr/bin/env bash

# This is a one off for creating the role we use to automate staging start/stop
# I'm preserving it here for information purposes. Most dev's will not need to worry
# about this

az ad sp create-for-rbac \
  --name vm-power-operator \
  --role "VM Power Operator" \
  --scopes /subscriptions/27a2932a-f7b5-48a8-9453-2d296e239296/resourceGroups/STAGING/providers/Microsoft.Compute/virtualMachines/staging-vm-v3