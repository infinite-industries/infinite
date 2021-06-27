#!/bin/bash

docker build -t infinite-api-server-staging --build-arg GIT_VERSION=development ./
