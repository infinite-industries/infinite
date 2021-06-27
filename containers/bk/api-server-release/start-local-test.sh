#!/bin/bash

set +e
docker stop infinite-api-server
docker rm infinite-api-server
set -e

PRIVATE_KEY_PATH="/home/chris/projects/infinite/api-server/keys/"

POSTGRES_USER="postgres"
POSTGRES_PW="xxx"
POSTGRES_HOST="outside"
POSTGRES_DB="infinite-api"
POSTGRES_PORT=5436

SLACK_WEBHOOK_TEST="https://hooks.slack.com/services/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"
SLACK_WEBHOOK_CONTACT="https://hooks.slack.com/services/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"
SLACK_WEBHOOK_EVENT_SUBMISSION="https://hooks.slack.com/services/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"
SLACK_WEBHOOK_VENUE_SUBMISSION="https://hooks.slack.com/services/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"

BITLY_TOKEN=401cbf1121b4859d3a0c8f09b623193eb0233fac
APP_URL=https://staging.infinite.industries:7779

HOST_IP=$(ip -4 addr show scope global dev docker0 | grep inet | awk '{print $2}' | cut -d / -f 1)

printf "Found host ip: %s\n" "$HOST_IP"

docker run --add-host outside:"$HOST_IP" -p 3003:3003 -d \
--name infinite-api-server \
--env POSTGRES_USER=$POSTGRES_USER \
--env POSTGRES_PW=$POSTGRES_PW \
--env POSTGRES_HOST=$POSTGRES_HOST \
--env POSTGRES_DB=$POSTGRES_DB \
--env POSTGRES_PORT=$POSTGRES_PORT \
--env SLACK_WEBHOOK_TEST=$SLACK_WEBHOOK_TEST \
--env SLACK_WEBHOOK_CONTACT=$SLACK_WEBHOOK_CONTACT \
--env SLACK_WEBHOOK_EVENT_SUBMISSION=$SLACK_WEBHOOK_EVENT_SUBMISSION \
--env SLACK_WEBHOOK_VENUE_SUBMISSION=$SLACK_WEBHOOK_VENUE_SUBMISSION \
--env BITLY_TOKEN=$BITLY_TOKEN \
--env APP_URL=$APP_URL \
--volume "$PRIVATE_KEY_PATH":/infinite/api-server/keys \
infinite-api-server-staging:latest