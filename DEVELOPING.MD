# Developing Infinite Industries

The Infinite Industries web app consists of the frontend `./web-portal`  built using Vue & Nuxt, and backend `./api-server` built using NestJS. For more info on each, please see their respective READMEs.

Except for the Postgres database, all external services (e.g. Auth0, AWS S3) fall back to local alternatives in dev mode.

## Local dev startup
There are a few ways to start the app for local development.

### Setup script

```sh
$ ./bin/setup
```

This script will:

- start the database (in an ephemeral Docker container),
- install node dependencies if necessary
- run migrations if necessary
- start the API server
- start the web portal
- open the portal in your default web browser

The script `wait`s after finishing startup; killing the script will shut down the dev servers and DB.

### Dev Container

The project can also be run in a [dev container](https://containers.dev/) or Github Codespace. The configuration stands up Postgres in a sidecar container, and populates the DB from a recent (sanitized) backup of production.

See [`docs/codespaces.md`](./docs/codespaces.md) for detailed instructions on running the project in a Codespace.

## Tech stack
### Database
- Postgres

### Authentication
- Auth0 in prod, but local dev supports hard-coded admin and partner users

### File Uploads
- AWS S3 in prod, but local dev writes to `api-server/dist/src/uploads/static/event-images/`.

### API Server
- [NestJS](https://docs.nestjs.com/): API framework for NodeJS

### Web Portal
- [Nuxt 3](https://nuxt.com/): Framework for Vue with opinionated defaults
- [Vue](https://vuejs.org/guide/introduction.html): JS library for building reactive web apps

### Dependencies
- [Node.js](https://nodejs.org/en/) 22.x.x
- [npm](https://www.npmjs.com/get-npm) 10.x.x
- [Postgres](https://www.postgresql.org/): >=9.4.0

### Connecting to services
- App: [http://localhost:7779](http://localhost:7779/)
- Local admin login:
  - Username: `test`
  - Password: `xxx`
- Swagger docs for API server: [http://localhost:3003/api](http://localhost:3003/api)
