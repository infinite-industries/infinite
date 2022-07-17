#!/usr/bin/env bash

# This is a convenience script for developers
# It assumes a local database is running

container_name="infinite-web-portal"
tag="${1:-local}"

docker run -p 7779:7779 \
  --name "$container_name" \
  --rm \
  --net=host \
  --env="API_URL=http://localhost:3003/v1" \
  --env="APP_URL=http://localhost:7779" \
  "$container_name:$tag"
