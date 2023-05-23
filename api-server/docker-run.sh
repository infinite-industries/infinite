#!/usr/bin/env bash

# This is a convenience script for developers
# It assumes a local database is running

container_name="infinite-industries/api-server"

docker run -p 3003:3003 \
  --name "$container_name" \
  --rm \
  --net=host \
  "$container_name:latest"
