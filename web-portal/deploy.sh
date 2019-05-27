#!/usr/bin/env bash

# script to deploy the web-api to a production or staging server
# the script makes the following assumptions:
#   * The environment of the host has values for LIVE_MAILGUN_API_KEY, BILLY_TOKEN,AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
#   * The host has a directory containing valid certs (same certs used for the web api)
#   * docker is installed
#   * the user is part of the docker group

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
  VERSION="0.0.1"

  docker build -t infiniteindustries/infinite-web-portal-staging:latest \
  --build-arg GIT_VERSION=development \
  --build-arg REDIRECT='http://$SERVER:7779/callback' ./

  docker push infiniteindustries/infinite-web-portal-staging:latest

  ssh $USER@$SERVER bash --login -i  << EOF
  docker stop infinite-web-portal
  docker rm infinite-web-portal
  sudo docker run -d --name infinite-web-portal \
  --env LIVE_MAILGUN_API_KEY=$LIVE_MAILGUN_API_KEY \
  --env BILLY_TOKEN=$BILLY_TOKEN \
  --env AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  --env AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  --volume ~/front_end_infinite/keys/ \
  -p 7779:7779 \
  infiniteindustries/infinite-web-portal-staging:latest
elif [[ "local" = $1 ]]; then
  # should be pretty much same as above, but we can build REDIRECT going to localhost host, change api, override API_URL,
  # change image tag and skip the ssh remote bit
EOF

  echo 'Done!'
else
  echo Please specify environment to deploy to.
  echo Usage: ./deploy.sh environment
  echo Example: ./deploy.sh staging
  exit
fi
