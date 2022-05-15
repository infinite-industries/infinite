#!/usr/bin/env bash

RESET_DB="${RESET_DB:-false}"

if [ "$RESET_DB" != "false" ]; then
  echo "reset the db"
  docker compose down
fi

docker-compose up
