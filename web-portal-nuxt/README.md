# Infinite Industries Portal Web Application

Front-end web application for [Infinite Industries](https://infinite.industries).

## Features

- **TODO**: [refer to Project Page] (https://github.com/infinite-industries/infinite/projects/1)

## Development Environment Setup

### Dependencies

You will need the following tools:

- [Node.js](https://nodejs.org/en/): 8.9.4 or higher
- [npm](https://www.npmjs.com/get-npm): 5.6.0 or higher

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

## Building for Production

1. Run the Nuxt build
 ```bash
 npm run build
 ```

2. Start the Nuxt production server
 ```bash
 npm run start
 ```

## Running Tests

The first time you run the tests you will need to configure [Cypress](https://cypress.io).

1. Set up the cypress environment file.

  ```bash
  cp cypress.env.json.sample cypress.env.json
  ```

2. **TODO: still need to fix auth for tests**

  ```bash
  cp cypress/fixtures/keys/1nfinite_testing.key keys/1nfinite_testing.key
  ```

## License

MIT
