Infinite Industries -- API Server
------------

Backend API [Infinite Industries](https://infinite.industries).

## Description

This provides an api around event data. It serves as the backend of ininite industries, but could be adpated to provide
an API to any sort of dataset concerning public events and resources.

This version of the API is a work in progress making use of the nest framework

## Todo

* Implement proper logging with Winston
* Ensure error logging works properly
* Implement more routes
* Tests
* Make sure we still do time conversion stuff on create event
* Remove slugs from create/update requests and make sure they are server side genearated
* THIS MAY HELP: https://www.freecodecamp.org/news/build-web-apis-with-nestjs-beginners-guide/

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Viewing swagger docs

[host]/api/
