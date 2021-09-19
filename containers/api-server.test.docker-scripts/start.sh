#!/usr/bin/env sh

cd /api-server

set +e

# delete any existing node_modules, we'll install these fresh
rm -rf ./node_modules

# delete the env file, we'll pass these through host environment
rm ./.env

set -e

echo "$INFINITE_PEM_FILE_CONTENTS" >> ./keys/1nfiniteDocker.pem

npm ci
npm run build
npm run start
