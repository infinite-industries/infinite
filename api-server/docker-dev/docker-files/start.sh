#!/bin/bash
set -e

cd /api-server

ls -la

echo 'try to run npm install'

npm install
npm run start:dev