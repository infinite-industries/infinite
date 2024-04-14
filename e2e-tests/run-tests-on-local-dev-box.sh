#!/usr/bin/env bash

echo "make sure you do not have any of the infinite stack running already"

# This is an attempt to make running the tests on local quick and easy, you may still want to do this the more manual
# way, but this tries to script a lot of that
export DB_HOST=localhost
export DB_PORT=6436
export DB_NAME=infinite-api
export DB_USER_NAME=postgres
export DB_PASSWORD=xxx

DB_CONTAINER_NAME=infinite-db-e2e

# === start database with docker
docker stop $DB_CONTAINER_NAME > /dev/null
docker run --name $DB_CONTAINER_NAME \
  --rm \
  -p $DB_PORT:5432 \
  -e POSTGRES_USER=$DB_USER_NAME \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -e POSTGRES_DB=$DB_NAME \
  -d postgres:9.6.2-alpine

# === wait for the database to be up and running
# test that a sql client is installed
if ! command -v psql &> /dev/null
then
  echo "The psql client must be installed for this script to work."
  exit 1
fi

WAIT_FOR_DB_NUM_RETRIES=10

echo "wait_for_db_num_retries: $WAIT_FOR_DB_NUM_RETRIES"
echo "DB_HOST: $DB_HOST, DB_PORT: $DB_PORT, DB_NAME: $DB_NAME, DB_USER_NAME: $DB_USER_NAME"

connect_retries=$WAIT_FOR_DB_NUM_RETRIES

# on linux you can use units, like 5s, but on mac you can't but seconds are the default on both systems
duration_for_wait=5

until PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" \
  -p "$DB_PORT" \
  -d "$DB_NAME" \
  -U "$DB_USER_NAME" \
  -c "select 1" > /dev/null 2>&1 || [ -z "$DB_PASSWORD" ]; do

  echo "Waiting for db $DB_NAME -- Max Retries: $CONNECT_RETRIES"
  connect_retries=$((connect_retries-=1))

  sleep $duration_for_wait

  if [[ $connect_retries -eq 0 ]]
  then
    echo "timed out waiting on the database"
    exit 1
  fi
done

trap "kill 0" EXIT

### === migrate and see the database
pushd ../api-server || exit 1
npm install
npm run db:migrate
npm run db:seed
npm run start:dev > ../e2e-tests/test-api-server.logs 2>&1 &
pid_api_server=$!
echo "api-server pid $pid_api_server"
popd || exit 1

pushd ../web-portal || exit 1
npm install
npm run start:dev > ../e2e-tests/test-web-portal.logs 2>&1 &
pid_web_portal=$!
echo "web-portal pid: $pid_web_portal"
popd || exit 1

npm install
npm run start:dev > test-runner.logs 2>&1 &
pid_test_runner=$!
echo "test-runner pid: $pid_test_runner"

echo "check test-api-server.logs, test-web-portal.logs and test-runner.logs for more info when debugging failures."
echo "when done press ctrl+c and this plus all the spawned processes should be stopped"

# this plus the trap "kill 0" EXIT line above, will make such that this process will keep going and also kill all the processes that it spawned when we stop it
wait




