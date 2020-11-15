#! /bin/bash

# This is for local testing.
#
# It stands up an empty postgres instance using docker. If the instance already exists it
# removes the instance and re-recreates it to ensure an empty db

db_exposed_port="$1"
db_container_name="infinite-db-test"
db_image_name='postgres:9.6.2-alpine'

db_name=infinite-api
db_passowrd=xxx
db_user=postgres

docker stop $db_container_name
docker rm $db_container_name

docker run \
  --name $db_container_name \
  -p $db_exposed_port:5432 \
  -e POSTGRES_USER=$db_user \
  -e POSTGRES_PASSWORD=$db_password \
  -e POSTGRES_DB=$db_name \
  -d \
  $db_image_name

set -e

WAIT_FOR_DB_NUM_RETRIES=10 \
DB_HOST=localhost \
DB_PORT=$db_exposed_port \
DB_NAME=$db_name \
DB_PASSOWRD=$db_password \
DB_USER=$db_user \
./waitForDb.sh

echo 'the database is ready for migrations'

npm run db:migrate -- --url "postgres://$db_user:$db_passowrd@localhost:$db_exposed_port/$db_name"

echo "done, the database is ready on port $db_exposed_port"
