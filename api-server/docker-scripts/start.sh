#!/usr/bin/env bash

DB_PORT="${DB_PORT-5436}"
DB_HOST=${DB_HOST-localhost}

/api-server/docker-scripts/wait-for-it.sh "$DB_HOST:$DB_PORT" -- npm start
