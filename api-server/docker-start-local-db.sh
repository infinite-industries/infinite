#!/usr/bin/env bash

# this is a convenience script for local developers. It starts a postgres data base server exposed on port 5436

docker run --name infinite-db \
  --rm \
  -p 5436:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=xxx \
  -e POSTGRES_DB=infinite-api \
  -d postgres:9.6.2-alpine
