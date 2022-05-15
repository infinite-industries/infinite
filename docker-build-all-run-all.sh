#!/usr/bin/env bash

set -e

./docker-build-all.sh
./docker-run-all.sh "$@"

set +e