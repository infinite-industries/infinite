#!/usr/bin/env bash

# Stops (deallocates) the staging VM.
# shellcheck source=_common.sh
source "$(dirname "${BASH_SOURCE[0]}")/_common.sh"

azure_post deallocate
