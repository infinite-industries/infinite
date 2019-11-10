#!/bin/bash

set +e
docker stop infinite-api-server-dev
docker rm infinite-api-server-dev
set -e

PROJECT_DIR=$(cd "../";pwd)

# get host ip as mapped to docker
HOST_IP=$(ip -4 addr show scope global dev docker0 | grep inet | awk '{print $2}' | cut -d / -f 1)

printf "Found host ip: %s\n" "$HOST_IP"

docker run --add-host outside:"$HOST_IP" -p 3003:3003 -d \
--volume "$PROJECT_DIR":/api-server \
--name infinite-api-server-dev \
infinite-api-server-dev:latest
