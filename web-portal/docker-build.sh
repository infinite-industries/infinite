#!/usr/bin/env bash

set -e

tag="${1:-local}"

script_name="docker-build"
container_name="infinite-industries/web-portal"

echo "$script_name: building $container_name for tag $tag"

docker build --build-arg "GOOGLE_ANALYTICS_ID=UA-73795062-1" -t "$container_name:$tag" .

echo "$script_name: finished building $container_name for tag $tag"

set +e
