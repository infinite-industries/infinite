#!/bin/bash
set -e

cd ./docker-files
docker build -t infinite-api-server-dev ./
