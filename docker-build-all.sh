#!/usr/bin/env bash

set -e

pushd ./api-server || exit
./docker-build.sh
popd || exit

pushd ./web-portal || exit
./docker-build.sh
popd || exit

set +e
