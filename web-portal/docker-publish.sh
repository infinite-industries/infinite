#!/usr/bin/env bash

set -e

tag="${1:=local}"
container_name="infinite-web-portal"
dockerhub_org="chriswininger"

push_to="$dockerhub_org/$container_name:$tag"

echo "publishing $push_to"

docker tag "$container_name:$tag" "$push_to"

docker push "$push_to"

echo "published $push_to"

set +e
