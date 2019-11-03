#!/usr/bin/env bash
set -e
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
  set +e
  rm -Rf $ROOT/temp-infinite/infinite

  set -e
  mkdir -p $ROOT/temp-infinite/infinite
  cd $ROOT/temp-infinite/infinite

  git clone https://github.com/infinite-industries/infinite.git ./

  echo 'Updating sources'
  git checkout development

  echo 'Installing npm packages'
  cd $ROOT/temp-infinite/infinite/api-server
  echo "$(pwd)"
  npm install --production

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
  forever start -a --uid infinite index.js
  echo 'Done!'
EOF

else
  echo Please specify environment to deploy to.
  echo Usage: ./deploy.sh environment
  echo Example: ./deploy.sh staging
  exit
fi
