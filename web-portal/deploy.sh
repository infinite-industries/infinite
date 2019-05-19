#!/usr/bin/env bash

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

  npm run production-build

  ssh $USER@$SERVER bash --login -i  << EOF

  echo "ROOT: $ROOT"
  mkdir -p $ROOT/temp-in
  cd $ROOT/temp-infinite

  if [ -d "./.git" ]
  then
    echo "cloning repository"
    git clone https://github.com/infinite-industries/infinite.git ./
  else
    echo 'Updating sources'
    git reset --hard HEAD
    git pull origin development
  fi

  git checkout origin development

  mkdir -p $ROOT/front_end_infinite/web-portal/public
  cd ./web-portal
  cp * -r $ROOT/front_end_infinite/.
  cd $ROOT/front_end_infinite

  if [ -d "$ROOT/front_end_infinite/public" ]
  then
    rm -R $ROOT/front_end_infinite/public
  fi

  echo 'Installing npm packages'
  npm install --production # this is super hacky since it brings giant crap like cypress to the server :(

  echo 'Restarting'
  forever stop infinite

  if [ -f "$ROOT/.forever/infinite.log" ]
  then
    rm $ROOT/.forever/infinite.log
  fi

  forever start --uid infinite ./server.js
  echo 'Done!'
EOF

  sftp $USER@$SERVER << EOF
  mkdir $ROOT/front_end_infinite/public
  cd $ROOT/front_end_infinite/
  put -r public
EOF
else
  echo Please specify environment to deploy to.
  echo Usage: ./deploy.sh environment
  echo Example: ./deploy.sh staging
  exit
fi
