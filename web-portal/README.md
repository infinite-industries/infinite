# Infinite Industries Portal Application

Front-end web application for [Infinite Industries](https://infinite.industries).

## Features

- **TODO**: someone should fill in this list

## Development Environment Setup

### Dependencies

You will need the following tools:

- [Node.js](https://nodejs.org/en/): 8.9.4 or higher
- [npm](https://www.npmjs.com/get-npm): 5.6.0 or higher
- Vue.js: [vue-cli 3.0](https://github.com/vuejs/vue-cli)

  ```bash
  npm install -g @vue/cli
  ```

### Recommended

The following tools will make your life easier:

- Vue.js devtools browser extension
  - [Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### Setup

This application communicates with an [API server](https://github.com/infinite-industries/infinite), which you will also need to run. The API server's URL can be configured in the env file.

1. Download the current version of Infinite Industries from GitHub

  ```bash
  git clone https://github.com/infinite-industries/front_end_infinite.git
  ```

2. Install dependencies

  ```bash
  npm install
  ```

3. Set up the env file and client config file. Sample files are provided with a `.sample` suffix. A core team member can send you the dev secrets via the Infinite Industries Slack.

 ```bash
 cp .env.sample .env    # main env file
 cp src/clientConfig.sample.js src/clientConfig.js  # Auth0 config that needs to be included in the JS bundle
 ```

4. Get the Auth0 public key from a core team member and copy it to the `keys/` directory. The name is configurable in the env file but defaults to `keys/1nfinite.pem`

5. Start the server

  ```bash
  npm run start-dev
  ```

  This sets up watchers to rebuild the client-side JS on changes and starts the server using nodemon to restart on changes; if you need to do these steps separately consult `package.json` to see how `start-dev` works.

6. If you have not already done so, start the API server. The API server can also be started prior to the portal server.

7. Point your browser to `http://localhost:7779`

## Running Tests

The first time you run the tests you will need to configure [Cypress](https://cypress.io).

1. Set up the cypress environment file.

  ```bash
  cp cypress.env.json.sample cypress.env.json
  ```

2. Copy the testing private key into the `keys/` directory

  ```bash
  cp cypress/fixtures/keys/1nfinite_testing.key keys/1nfinite_testing.key
  ```

During testing, this key pair substitutes for the real Auth0 key pair, allowing the tests to generate valid JWTs for ad-hoc authentication without contacting Auth0.

**NOTE**: the `1nfinite_testing` key pair is provided in source control for convenience and should not be used in any production context.

`npm test` starts the Portal application in test mode, using the above-mentioned key pair for verifying auth tokens, and launches the Cypress test runner. You will also need to run the API server.

## DOCKER/RELEASE PROCESS

#### Build Container

To build the development branch run:

`docker build -t infinite-web-portal --build-arg GIT_VERSION=development ./`

To run the development image execute (assuming all environment variables set on host):

```
docker run -d --name infinite-web-portal \
--env LIVE_MAILGUN_API_KEY=$LIVE_MAILGUN_API_KEY \
--env BILLY_TOKEN=$BILLY_TOKEN \
--env AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
--env AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
--volume '/Users/chris/projects/infinite-industries/infinite/web-portal/keys/' \
-p 7779:7779 \
infinite-web-portal:latest
```

## License

MIT
