#!/usr/bin/env bash

# An alternative to using this script is to use a just recipe:
#
# $ just name=infinite-industries/api-server tag=local build
#
# An alternative alternative is to make use of a .env file and just:
#
# $ printf "IMAGE_NAME=infinite-industries/api-server\nIMAGE_TAG=local" > .env
# $ just build

set -e

tag="${1:-local}"

script_name="docker-build"
container_name="infinite-industries/api-server"

echo "$script_name: building $container_name for tag $tag"

docker build -t "$container_name:$tag" .

echo "$script_name: finished building $container_name for tag $tag"

set +e
