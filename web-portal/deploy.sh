#!/usr/bin/env bash

# This script assumes the remote host has a correctly configured .env file
# in the root of the user directory. This is what will be used

#npm run production-build

USER='ubuntu'

SERVER=''
if [[ "production" = $1 ]]; then
  # ROOT='/home/ubuntu/front_end_infinite'
  # SERVER='infinite.industries'
  #
  # ssh $USER@$SERVER bash --login -i << EOF
  # cd $ROOT
  # echo 'Updating sources'
  # git reset --hard HEAD
  # git checkout master
  # git pull
  # echo 'Installing npm packages'
  # npm install --production
  # echo 'Restarting'
  # #npm run server-build
  # #echo 'Building frontend js'
  # forever stop infinite
  # rm /home/$USER/.forever/infinite.log
  # forever start --uid infinite server.js
  echo 'Have not implemented prod for this deploy process'
EOF
elif [[ "staging" = $1 ]]; then
  # ROOT='/home/ubuntu/front_end_infinite'
  ROOT='/home/ubuntu'
  SERVER='staging.infinite.industries'

  ssh $USER@$SERVER bash --login -i  << EOF

  echo "ROOT: $ROOT"
  rm -R $ROOT/temp-infinite
  mkdir -p $ROOT/temp-infinite
  cd $ROOT/temp-infinite

  git clone https://github.com/infinite-industries/infinite.git ./
  # git pull origin development
  git checkout development
  cd ./web-portal
  cp $ROOT/.env $ROOT/temp-infinite/web-portal/ # copy .env file

  echo 'Installing npm packages'
  npm install # this sucks we have to pull in cypress :-(

  echo 'Build Nuxt'
  npm run build

  echo 'stop infinite'
  forever stop infinite

  echo 'copying build to running directory'
  mkdir -p $ROOT/web-portal
  cp ./. -r $ROOT/web-portal/
  cd $ROOT/web-portal

  if [ -f "$ROOT/.forever/infinite.log" ]
  then
    echo 'deleting old log file'
    rm $ROOT/.forever/infinite.log
  fi

  forever start -a --uid infinite -c "npm start" ./
  echo 'Done!'
EOF
else
  echo Please specify environment to deploy to.
  echo Usage: ./deploy.sh environment
  echo Example: ./deploy.sh staging
  exit
fi
