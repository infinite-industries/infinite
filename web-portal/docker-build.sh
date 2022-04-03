#!/usr/bin/env bash

set -e

script_name="docker-build"
container_name="infinite-web-portal"

echo "$script_name: building $container_name"

docker build -t "$container_name:latest" .

echo "$script_name: finished building $container_name"

set +e
