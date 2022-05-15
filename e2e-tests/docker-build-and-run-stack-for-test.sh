#!/usr/bin/env bash

pushd ../ || exit

RESET_DB=true SEED_VENUES=true ./docker-build-all-run-all.sh -d

popd || exit
