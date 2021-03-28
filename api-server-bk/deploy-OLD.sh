#!/usr/bin/env bash

ROOT='/home/deploy/infinite'
USER='deploy'

SERVER=''
if [[ "production" = $1 ]]; then
  SERVER='api.infinite.industries'
elif [[ "staging" = $1 ]]; then
  SERVER='api-staging.infinite.industries'  #not used yet
else
  echo Please specify environment to deploy to.
  echo Usage: ./deploy.sh environment
  echo Example: ./deploy.sh staging
  exit
fi

ssh $USER@$SERVER << EOF
  cd $ROOT
  echo 'Updating sources'
  git reset --hard HEAD
  git checkout master
  git pull origin master
  echo 'Installing npm packages'
  npm install
  echo 'Restarting'
  forever stop infinite
  rm /home/$USER/.forever/infinite.log
  forever start --uid infinite index.js
  echo 'Done!'
EOF
