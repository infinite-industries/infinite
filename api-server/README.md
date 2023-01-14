# Infinite Industries API Server

Backend API powering [Infinite Industries](https://infinite.industries).

* [Installation]()
* [Running integration tests]()
* [Running the app]()
* [Test]()
* [Viewing swagger docs]()
* [Deploying]()
* [Development Environment Setup using Docker &amp; docker-compose]()
   * [Quick Start]()
   * [Common Task: Development]()
   * [Common Task: Create a database using a production snapshot]()
   * [Common Task: Publish a new Docker image]()
* [Development Environment Setup [OLD]]()
   * [Dependencies]()
   * [Setup]()
* [License]()


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

## Deploying

This requires that you have access to the target server through ssh-key authentication and that the target server is
properly configured, with the appropriate .env file and pem file in its home directory

run: `./deploy.sh <environment>`

## Development Environment Setup using Docker & docker-compose

Dependencies:
- [docker](https://www.docker.com)
- [casey/just](https://github.com/casey/just/releases/)

### Quick Start

These commands will build local docker images and start the environment.  The
API can be accessed at http://localhost:3003/api

```console
$ cp .env.sample .env
$ cp keys/1nfinite.pem 1nfinite.pem
$ just build start
```

Notes:
* A `.env` file is used to set values for many variables. Multiple tools in the
  toolchain- `just`, `docker-compose`, and `npm` and `node` (via
  [dotenv](https://www.npmjs.com/package/dotenv)) all use this file. Different
  values are used for different enviroments.  The `.env.sample` includes variables
  appropriate for local development.
* The key `1nfinite.pem` is used for ??
* `just` is used as a task runner: the *build* recipe create a docker image and
  the *start* recipe starts it and a postgres database as docker containers.

Other `just` recipes can be displayed by invoking it without arguments:

```console
$ just
Available recipes:
    build                # build the api-server docker image
    clean                # cleatn the docker-compose environment
    clean-api            # stop and remove the api container
    clean-db             # stop the environment and remove the database container
    create-api           # create the api container
    create-db            # create the database container
    default              # display this help
    populate-db dumpfile # populate a database container using the pg_dump file specified
    publish              # publish the api-server docker image to docker.io
    rebuild-api          # rebuild the api-server image & start the api
    start                # start a local docker-based environment via docker-compose
    start-api            # start the api service
    start-db             # start the database
    stop                 # stop the docker-compose environment
```

### Common Task: Development

To make changes visible:
```console
$ just rebuild-api
```

### Common Task: Create a database using a production snapshot

```console
$ just clean-db
docker-compose stop db                                
[+] Running 1/1                                       
 ⠿ Container api-server-db-1  Stopped                                                                  0.3s
docker-compose rm db                                                                                        
? Going to remove api-server-db-1 Yes          
[+] Running 1/0                                       

$ just populate-db ../../infinite-prod-bk-folder/backups/infinite-prod-dump-1670627125
```

### Common Task: Publish a new Docker image

Using image name specified in `.env`:
```console
$ just publish
```

Overriding the image name specified in `.env`:
```console
$ IMAGE_NAME=chriswininger/infinite-api-server just publish
```

## Development Environment Setup [OLD]

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

## License

MIT
