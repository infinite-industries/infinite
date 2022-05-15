#!/usr/bin/env bash

DB_PORT="${DB_PORT:-5436}"
DB_HOST=${DB_HOST:-localhost}
SEED_VENUES="${SEED_VENUES:-false}"

if [ "$SEED_VENUES" != "false" ]; then
    echo "seeding venues"
    pushd /api-server/ || exit
    npm run db:seed:venues
    popd || exit
fi

/api-server/docker-scripts/wait-for-it.sh "$DB_HOST:$DB_PORT" -- npm start
