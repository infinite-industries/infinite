#!/usr/bin/env bash

echo "start with API_URL: $API_URL"

# Fix auth, terrible terrible hack dist/server/server.js
grep -rl "http://localhost:3003/v1" ./ | xargs  sed -i "s|http://localhost:3003/v1|$API_URL|g"

echo "run web-portal USE_PROXY: $USE_PROXY"

if [ -z "$USE_PROXY" ]
then
    echo "skipping proxy server, you can enable the proxy server by setting USE_PROXY"
else
    echo 'initialize proxy server'
    pushd ./docker-scripts/proxy-server || exit
    node ./proxy-server &
    popd || exit
fi

npm start
