# Infinite Industries Portal Web Application

Front-end web application for [Infinite Industries](https://infinite.industries).

## Features

- **TODO**: [refer to Project Page] (https://github.com/infinite-industries/infinite/projects/1)

## Development Environment Setup

### Dependencies

You will need the following tools:

- [Node.js](https://nodejs.org/en/): 8.9.4 or higher
- [npm](https://www.npmjs.com/get-npm): 5.6.0 or higher
- Vue.js: [vue-cli 3.0](https://github.com/vuejs/vue-cli)
- NUXT [nuxt 2.0.0](https://nuxtjs.org/)


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
  cd web-portal-nuxt
  npm install
  ```

3. Set up the env file. Sample files are provided with a `.sample` suffix. A core team member can send you the dev secrets via the Infinite Industries Slack.

 ```bash
 cp .env.sample .env    # main env file
 ```

4. Start the server
 ```bash
 npm run dev
 ```

5. If you have not already done so, start the API server. The API server can also be started prior to the portal server.

6. Point your browser to `http://localhost:7779`