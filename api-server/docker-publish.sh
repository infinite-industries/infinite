#!/usr/bin/env bash

# NOTE: using just is an alternative to this script:
# just tag=local name=infinite-industries/api-server publish

set -e

tag="${1:-local}"
container_name="infinite-industries/api-server"
registry="ghcr.io"

push_to="$registry/$container_name:$tag"

echo "publishing $push_to"

docker tag "$container_name:$tag" "$push_to"

docker push "$push_to"

echo "published $push_to"

set +e
