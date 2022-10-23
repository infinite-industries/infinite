#!/bin/bash

source ./.env

docker run \
  --network host -it \
  --rm -p 8888:8888 \
  --env "INFINITE_PW=$INFINITE_PW" \
  --env "DB_HOST=$DB_HOST" \
  --env "DB_PORT=$DB_PORT" \
  --env "DB_NAME=$DB_NAME" \
  --env "DB_USER_NAME=$DB_USER_NAME" \
  --env "DB_PW=$DB_PW" \
  -v "${PWD}/work":/home/jovyan/work \
  chriswininger/infinite-notebook
