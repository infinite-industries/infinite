#!/usr/bin/env bash

USER='ubuntu'

SERVER=''
if [[ "production" = $1 ]]; then
  ROOT='/home/ubuntu/app/new_mvp'
  SERVER='infinite.industries'
elif [[ "staging" = $1 ]]; then
  ROOT='/home/ubuntu/new_mvp'
  SERVER='staging.infinite.industries'
else
  echo Please specify environment to deploy to.
  echo Usage: ./deploy.sh environment
  echo Example: ./deploy.sh staging
  exit
fi

npm run production-build

ssh $USER@$SERVER << EOF
  cd $ROOT
  echo 'Updating sources'
  git reset --hard HEAD
  git checkout master
  git pull
  echo 'Installing npm packages'
  npm install --production
  echo 'Restarting'
  #npm run server-build
  #echo 'Building frontend js'
  forever stop mvp
  rm /home/$USER/.forever/mvp.log
  forever start --uid mvp server.js
  echo 'Done!'
EOF

scp public/js/dist.js $USER@$SERVER:$ROOT/public/js
