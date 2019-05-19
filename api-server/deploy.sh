#!/usr/bin/env bash

ROOT='/home/ubuntu'
USER='ubuntu'

SERVER=''
if [[ "production" = $1 ]]; then
  SERVER='api.infinite.industries'

  # ssh $USER@$SERVER bash --login -i << EOF
  #   cd $ROOT
  #   echo 'Updating sources'
  #   git reset --hard HEAD
  #   git checkout master
  #   git pull origin master
  #   echo 'Installing npm packages'
  #   npm install
  #   echo 'Restarting'
  #   forever stop infinite
  #   rm /home/$USER/.forever/infinite.log
  #   forever start --uid infinite index.js
    echo 'Prod build not implemented yet!'
EOF

elif [[ "staging" = $1 ]]; then
  SERVER='staging-api.infinite.industries'  #not used yet

  ssh $USER@$SERVER bash --login -i << EOF
    mkdir -p $ROOT/temp-infinite/infinite
    cd $ROOT/temp-infinite/infinite

    if [ -d "./.git" ]
    then
      echo "cloning repository"
      git clone https://github.com/infinite-industries/infinite.git ./
    else
      echo 'Updating sources'
      git reset --hard HEAD
      git pull origin master
    fi

    echo 'Updating sources'
    git checkout master

    cd ./api-server
    cp * -r $ROOT/infinite/.
    cd $ROOT/infinite

    echo 'Installing npm packages'
    npm install --production
    forever stop infinite

    if [ -f "$ROOT/.forever/infinite.log" ]
    then
      rm $ROOT/.forever/infinite.log
    fi
      forever start --uid infinite index.js
      echo 'Done!'
EOF

else
  echo Please specify environment to deploy to.
  echo Usage: ./deploy.sh environment
  echo Example: ./deploy.sh staging
  exit
fi
