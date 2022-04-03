#!/usr/bin/env bash

# This script assumes the remote host has a correctly configured .env file
# in the root of the user directory and .pem in the same place. This is what will be used

set -e
ROOT='/home/ubuntu'
USER='ubuntu'
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
  rm -Rf $ROOT/temp-infinite/infinite

  set -e
  mkdir -p $ROOT/temp-infinite/infinite
  cd $ROOT/temp-infinite/infinite

  git clone https://github.com/infinite-industries/infinite.git ./

  echo 'Updating sources'
  git checkout $GIT_HEAD

  echo 'Installing npm packages'
  cd $ROOT/temp-infinite/infinite/api-server
  echo "$(pwd)"
  npm ci # can't do --production because we need to execute build process here... for now

  echo 'Running Build'
  npm run build

  echo 'stopping infinite'
  set +e
  forever stop infinite
  set -e

  echo 'copying temp files'
  rm -Rf $ROOT/infinite
  mv $ROOT/temp-infinite/infinite/api-server $ROOT/infinite
  rm -Rf $ROOT/temp-infinite

  echo 'copying env settings'
  cp $ROOT/.env $ROOT/infinite/.env
  cp $ROOT/1nfinite.pem $ROOT/infinite/keys/1nfinite.pem

  if [ -f "$ROOT/.forever/infinite.log" ]
  then
    rm $ROOT/.forever/infinite.log
  fi

  echo 'starting server'
  cd $ROOT/infinite
  npm run db:migrate
  forever start -a --uid infinite dist/src/main.js
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
  SERVER='api.infinite.industries'
  GIT_HEAD='master'
  set_alt_branch $1 $2
  promptUser
elif [[ "staging" = $1 ]]; then
  SERVER='staging-api.infinite.industries'
  GIT_HEAD='development'
  set_alt_branch $1 $2
  doDeploy
else
  echo Please specify environment to deploy to.
  echo Usage: ./deploy.sh environment
  echo Example: ./deploy.sh staging
  exit
fi


