#!/usr/bin/env bash

# This script assumes the remote host has a correctly configured .env file
# in the root of the user directory. This is what will be used

set -e
ROOT='/home/ubuntu'
USER='ubuntu'
GIT_HEAD=''

SERVER=''

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
  ssh $USER@$SERVER bash --login -i  << EOF

  echo "ROOT: $ROOT"
  rm -R $ROOT/temp-infinite
  mkdir -p $ROOT/temp-infinite
  cd $ROOT/temp-infinite

  git clone https://github.com/infinite-industries/infinite.git ./
  # git pull origin development
  git checkout $GIT_HEAD
  cd ./web-portal
  cp $ROOT/.env $ROOT/temp-infinite/web-portal/ # copy .env file

  echo 'Installing npm packages'
  npm install

  echo 'Build Nuxt'
  npm run build

  echo 'stop infinite'
  set +e
  forever stop infinite
  set -e

  echo 'copying build to running directory'
  set +e
  rm -R $ROOT/web-portal
  set -e
  mv $ROOT/temp-infinite/web-portal $ROOT/web-portal
  cd $ROOT/web-portal

  if [ -f "$ROOT/.forever/infinite.log" ]
  then
    echo 'deleting old log file'
    rm $ROOT/.forever/infinite.log
  fi

  forever start -a --uid infinite -c "./node_modules/.bin/nuxt start" ./
  echo 'Done!'
EOF
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

