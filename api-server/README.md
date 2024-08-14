# Infinite Industries API Server

DON'T MERGE THIS PR

Backend API powering [Infinite Industries](https://infinite.industries).

## Features

- **TODO**: [refer to Project Page] (https://github.com/infinite-industries/infinite/projects/1)

## Development Environment Setup

### Dependencies

You will need the following tools:

- [Node.js -- Install with NVM](https://github.com/nvm-sh/nvm): 20.x.x
- [npm](https://www.npmjs.com/get-npm): 10.x.x
- [Postgres](https://www.postgresql.org/): 9.4.0 or higher
- [docker](https://www.docker.com)

### Setup

Set up the env file and add *1nfinite.pem* file to keys directory. Sample files are provided with a `.sample` suffix.
A core team member can send you the dev secrets via the Infinite Industries Slack.

 ```bash
 cp .env.sample .env
 cp keys/1nfinite.pem 1nfinite.pem    
 ```

## Installation

```bash
$ npm install
```

## running integration tests

- put keys in the keys directory
- `npm run test:e2e`

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

`[host]/api/`

local: http://localhost:3003/api/
prod:  https://api.infinite.industries/api/

## API Design Philosophy and Best Practices

* While database models use snake for fields the API should generally use camel case.
* Exceptions have been made for this where the data directly represents a database entity.
  * This is not ideal, we should not directly expose database model definitions via the api, but shortcuts
    have been taken.
* Endpoints should be as self descriptive as possible. You should be able to read the url and have a good idea what
  the endpoint does.
* Endpoints that requires authentication should be grouped into .authenticated controllers to make them stand out, see
  for example, the events.authenticated.controller.

## License

MIT
