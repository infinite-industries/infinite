#!/usr/bin/env bash

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
