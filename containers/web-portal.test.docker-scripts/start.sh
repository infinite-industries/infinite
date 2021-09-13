#!/usr/bin/env sh

echo 'initialize proxy server'
cd /scripts/proxy-server
node ./proxy-server &

cd /web-portal

echo 'cleanup env files'
set +e

# delete any existing node_modules, we'll install these fresh
rm -rf ./node_modules

# delete the env file, we'll pass these through host environment
rm ./.env

set -e

echo 'install and run'
npm install # can't use npm ci because we need build tooling
npm run build
npm run start
