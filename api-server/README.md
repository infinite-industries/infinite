# Infinite Industries API Server

Backend API [Infinite Industries](https://infinite.industries).

## Features

- **TODO**: [refer to Project Page] (https://github.com/infinite-industries/infinite/projects/1)

## Development Environment Setup

### Dependencies

You will need the following tools:

- [Node.js](https://nodejs.org/en/): 8.9.4 or higher
- [npm](https://www.npmjs.com/get-npm): 5.6.0 or higher
- [Postgres](https://www.postgresql.org/): 9.4.0 or higher


### Recommended

The following tools will make your life easier:

- Vue.js devtools browser extension
  - [Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### Setup

This application communicates with an [API server](https://github.com/infinite-industries/infinite), which you will also need to run. The API server's URL can be configured in the env file.

1. Download the current version of Infinite Industries from GitHub

  ```bash
  git clone https://github.com/infinite-industries/infinite.git
  ```

2. Install dependencies

  ```bash
  cd api-server
  npm install
  ```

3. Set up the env file and add *1nfinite.pem* file to keys directory. Sample files are provided with a `.sample` suffix. A core team member can send you the dev secrets via the Infinite Industries Slack.

 ```bash
 cp .env.sample .env
 cp keys/1nfinite.pem 1nfinite.pem    
 ```

#### Import Mock data here


4. Start the server
 ```bash
 npm run start-dev
 ```

### deploying
run: `./deploy.sh <enironment>`

assumes that the server has an 1nfinite.pem and a .env in $ROOT

