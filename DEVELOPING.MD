# Developing Infinite Industries
The Infinite Industries web app consists of the frontend `./web-portal`  built using Vue & Nuxt and backend `./api-server` built using NestJS. For more info on each, please see their respective READMEs.

## Tech stack
### Database
- Postgres

### API Server
- [NestJS](https://docs.nestjs.com/): API framework for NodeJS

### Web Portal
- [Nuxt 3](https://nuxt.com/): Framework for Vue with opinionated defaults
- [Vue](https://vuejs.org/guide/introduction.html): JS library for building reactive web apps

## Local dev startup
There are a few ways to start the app for local development. One way:

 `$ ./bin/setup`

This script will start the database (in a Docker container), API server, and web portal.

### Dependencies
- [Node.js](https://nodejs.org/en/) 22.x.x
- [npm](https://www.npmjs.com/get-npm) 10.x.x
- [Postgres](https://www.postgresql.org/): >=9.4.0

### Connecting to services
- App: [http://localhost:7779](http://localhost:7779/)
  - Username: `test`
  - Password: `xxx`

- Swagger docs for API server: [http://localhost:3003/api](http://localhost:3003/api)
