#!/usr/bin/env bash

# This script assumes the remote host has a correctly configured .env file
# in the root of the user directory and .pem in the same place. This is what will be used

set -e
ROOT='/home/ubuntu'
USER='infinite'
GIT_HEAD=''
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
  ssh $USER@$SERVER bash --login -i << EOF
  set +e
  cd ./docker-files
  docker-compose fetch
  docker-compose down
  docker-compose up -d

  echo 'Done!'
EOF
  echo "Deploy Complete To $SERVER"
}

function set_alt_branch() {
  if [ -n "$2" ];
  then
    if [[ "production" = $1 ]]; then
      echo "Deploying alternative branches direct to production is not allowed. Is this a typo?"
      exit
    fi

    echo "deploying alternative branch to staging server: '$2'"
    GIT_HEAD=$2
  fi
}

if [[ "production" = $1 ]]; then
  SERVER='infinite.industries'
  GIT_HEAD='master'
  set_alt_branch $1 $2
  promptUser
elif [[ "staging" = $1 ]]; then
  SERVER='staging.infinite.industries'
  GIT_HEAD='development'
  set_alt_branch $1 $2
  doDeploy
else
  echo Please specify environment to deploy to.
  echo Usage: ./deploy.sh environment
  echo Example: ./deploy.sh staging
  exit
fi
