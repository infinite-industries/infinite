# Infinite Industries API Server

Backend API powering [Infinite Industries](https://infinite.industries).

## Development Environment Setup

### Dependencies

You will need the following tools:

- [Node.js -- Install with NVM](https://github.com/nvm-sh/nvm): 22.x.x
- [npm](https://www.npmjs.com/get-npm): 10.x.x
- [Postgres](https://www.postgresql.org/): 9.4.0 or higher
- [docker](https://www.docker.com)

Install dependencies:

```bash
$ cd api-server
$ npm install
```

### Setup

There are sane defaults for all env configuration, including local database connection (see below). The only secondary service strictly required under development is the database; everything else (auth, file storage, etc) falls back on local behavior for convenience.

If you need to override something, e.g. to test real auth, you can set the appropriate env vars or use an env file. A sample file is provided with a `.sample` suffix.

 ```bash
 cp .env.sample .env
 ```

### Set up Database

The [docker-start-local-db.sh](./docker-start-local-db.sh) script will start a Postgres database in a Docker container with default database name and credentials. When started in dev mode, the API server will connect to this DB automatically.

## Running the App

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
