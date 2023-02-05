#!/usr/bin/env bash

# This script assumes the remote host has a correctly configured .env file
# in the root of the user directory and .pem in the same place. This is what will be used

set -e
USER='infinite'

SERVER=''
DEPLOY_TYPE=$1

function promptUser {
  echo "WARNING THIS IS PROD: Are you sure?"
  select yn in "yes" "no"; do
    case $yn in
      yes ) doDeploy; break;;
      no ) exit;;
    esac
done
}

function doDeploy {
  echo "deploying to $SERVER"
  ssh "$USER@$SERVER" bash --login -i << EOF
  set +e
  cd ./docker-files
  docker-compose pull
  docker-compose down
  docker-compose up -d

  echo 'Done!'
EOF
  echo "Deploy Complete To $SERVER"
}

if [[ "production" = "$DEPLOY_TYPE" ]]; then
  SERVER='infinite.industries'
  promptUser
elif [[ "staging" = "$DEPLOY_TYPE" ]]; then
  SERVER='staging.infinite.industries'
  doDeploy
else
  echo Please specify environment to deploy to.
  echo Usage: ./deploy.sh environment
  echo Example: ./deploy.sh staging
  exit
fi
