# Infinite Industries API Server

Backend API powering [Infinite Industries](https://infinite.industries).

## Features

- **TODO**: [refer to Project Page] (https://github.com/infinite-industries/infinite/projects/1)

## Development Environment Setup

### Dependencies

You will need the following tools:

- [Node.js -- Install with NVM](https://github.com/nvm-sh/nvm): 16.x.x or higher
- [npm](https://www.npmjs.com/get-npm): 8.x.x or higher
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

## Debugging Sequelize

If you want to see logs of the queries sequelize is executing you can set SEQUELIZE_LOGGING to true, for example

`SEQUELIZE_LOGGING=true npm run start:dev`

This is not something you should do in production but can be useful locally when updating or adding database queries.

## License

MIT
