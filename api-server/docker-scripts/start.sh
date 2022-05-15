#!/usr/bin/env bash

set -e

DB_PORT="${DB_PORT:-5436}"
DB_HOST=${DB_HOST:-localhost}
SEED_VENUES="${SEED_VENUES:-false}"

echo "Running API Server Startup Script"
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "SEED_VENUES: $SEED_VENUES"

if [ "$SEED_VENUES" != "false" ]; then
    echo "seeding venues"
    pushd /api-server/ || exit
    /api-server/docker-scripts/wait-for-it.sh "$DB_HOST:$DB_PORT" -- npm run db:migrate
    /api-server/docker-scripts/wait-for-it.sh "$DB_HOST:$DB_PORT" -- npm run db:seed:venues
    popd || exit
fi

/api-server/docker-scripts/wait-for-it.sh "$DB_HOST:$DB_PORT" -- npm start

set +e
