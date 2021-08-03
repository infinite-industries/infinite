#!/usr/bin/env bash

ENV_ARG=$1

if [ -z "$ENV_ARG" ];
then
    echo "No env specified [test, dev, prod]"
    echo "defaulting to test"
    echo ""
    ENV_ARG='test'
fi

ENV_FILE="./.env.$ENV_ARG"
FILE="./docker-compose.$ENV_ARG.yml"

# make sure we start fresh
docker-compose \
  --file $FILE \
  --env-file $ENV_FILE \
  rm \
  --stop \
  --force

# make sure they get built fresh
docker-compose \
  --file $FILE \
  --env-file $ENV_FILE \
 build

# start the stack
docker-compose \
  --file $FILE \
  --env-file $ENV_FILE \
  up \
  --force-recreate \
  --detach
