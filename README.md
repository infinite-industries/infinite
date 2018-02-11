# Infinite Industries Front-End

## Description

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer accumsan fermentum nunc, eu bibendum leo facilisis id. In id risus placerat, iaculis ex sit amet, dignissim eros. Fusce mauris enim, ultricies a cursus et, tincidunt sed neque. Nam hendrerit sodales tempor. Donec mattis, leo nec convallis sollicitudin, metus felis varius.

## Features

- Phasellus ornare lacinia tellus ac eleifend.
- Mauris vel efficitur mauris, eget luctus lorem.
- Morbi lacinia mauris vitae maximus efficitur.
- Nunc finibus mauris quis orci interdum cursus et nec ex.
- Sed semper pretium ipsum id fermentum.
- Phasellus vitae tellus non urna lacinia placerat.

## Development Environment Setup

#### Dependencies:
To set up the Infinite Industries front-end development environment, you will need the following tools:

- [Node.js](https://nodejs.org/en/): 8.9.4 or higher
- [npm](https://www.npmjs.com/get-npm): 5.6.0 or higher
- Vue.js: [vue-cli 3.0](https://github.com/vuejs/vue-cli)
```bash
$ npm install -g @vue/cli
```
- An `.env` file (see below)

#### Recommended:
The following tools will make your life easier:
- [nodemon](https://nodemon.io/)
```bash
$ npm install -g nodemon
```
- Vue.js devtools browser extension
 - [Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
 - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## Getting Started

1. Download the current version of Infinite Industries from GitHub
```bash
$ git clone https://github.com/infinite-industries/front_end_infinite.git
```
2. Install project dependencies and devDependencies
```bash
$ npm install
```
3. Launch Watchify
```bash
$ npm run watchify
```
4. Start the Node.JS server
```bash
$ node server.js
```
5. Launch the Infinite Industries back-end
```bash
$ node index.js
```
Find back-end setup in the [infinite back-end](https://github.com/infinite-industries/infinite) README.

6. Point your browser to http://localhost:7779

## Environment Config

Use the following template to set up your `.env` file and store it in the root folder of the project.
```
SITE_URL=http://localhost:7779
API_URL=http://localhost:3003
API_KEY=########-####-####-####-############

SLACK_WEBHOOK_TEST=###############################################
SLACK_WEBHOOK_CONTACT=##################################################
SLACK_WEBHOOK_EVENT_SUBMISSION=################################################

...
```

## License

MIT?
