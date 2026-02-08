# Infinite Industries API Server

Backend API powering [Infinite Industries](https://infinite.industries).

## Features

- **TODO**: [refer to Project Page](https://github.com/infinite-industries/infinite/projects/1)

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

### Running tests in IntelliJ

Go to Run/Run... in the menu. In the menu that pops up, choose "Edit Configurations..." 
![Screenshot from 2026-02-08 14-29-26.png](readme-assets/Screenshot%20from%202026-02-08%2014-29-26.png)

Look for "Edit Configuration templates..." in the lower left hand of the dialog
![Screenshot from 2026-02-08 14-30-17.png](readme-assets/Screenshot%20from%202026-02-08%2014-30-17.png)

Click it and choose Jest, then set "jest options" to

`--config ./test/jest-e2e.json --runInBand`

![Screenshot from 2026-02-08 14-36-24.png](readme-assets/Screenshot%20from%202026-02-08%2014-36-24.png)

Finally, go to the spec and press play next to one of the tests:
![Screenshot from 2026-02-08 14-27-17.png](readme-assets/Screenshot%20from%202026-02-08%2014-27-17.png)

## Viewing swagger docs

`[host]/api/`

local: http://localhost:3003/api/
prod:  https://api.infinite.industries/api/

## Migrations

* Create a new migration script: `npm run db:migrate:generate -- --name={a-descriptive-name}`

## API Design Philosophy and Best Practices

* While database models use snake case for fields, the API should generally use camel case.
* Exceptions have been made for this where the data directly represents a database entity.
  * This is not ideal, we should not directly expose database model definitions via the api, but shortcuts
    have been taken.
* Endpoints should be self-descriptive. The URL alone should tell you what it does.
* Endpoints that requires authentication should be grouped into .authenticated controllers to make them stand out, see
  for example, the events.authenticated.controller.

## License

MIT
