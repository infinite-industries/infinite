#!/usr/bin/env bash

npm run production-build

USER='ubuntu'

SERVER=''
if [[ "production" = $1 ]]; then
  ROOT='/home/ubuntu/front_end_infinite'
  SERVER='infinite.industries'

  ssh $USER@$SERVER bash --login -i << EOF
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
  forever stop infinite
  rm /home/$USER/.forever/infinite.log
  forever start --uid infinite server.js
  echo 'Done!'
EOF
elif [[ "staging" = $1 ]]; then
  ROOT='/home/ubuntu/front_end_infinite'
  SERVER='staging.infinite.industries'

  ssh $USER@$SERVER bash --login -i  << EOF

  cd $ROOT
  echo 'Updating sources'
  git reset --hard HEAD
  git checkout development
  git pull
  echo 'Installing npm packages'
  npm install --production
  echo 'Building frontend js'
  npm run production-build
  echo 'Restarting'
  forever stop infinite
  rm /home/$USER/.forever/infinite.log
  forever start --uid infinite server.js
  echo 'Done!'
EOF
else
  echo Please specify environment to deploy to.
  echo Usage: ./deploy.sh environment
  echo Example: ./deploy.sh staging
  exit
fi
