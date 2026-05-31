# Contributing to Infinite Industries

Thank you for your interest in contributing to the project.

Infinite Industries is an all-volunteer team, based in Lexington, KY, with a particular current focus on supporting the greater Lexington / Central KY-area arts and culture scene, and we welcome contributions from far and wide. We encourage you to reach out via email at [info@infinite.industries](mailto:info@infinite.industries) or via the website's [contact form](https://infinite.industries/contact).

While our long-term goal is for the project to be broadly adopted / adapted to support many communities, we believe it necessary to ensure the project is well-established and self-sustaining in our local area first. This is not meant to discourage contribution: we are open to discussing interesting ideas and feature suggestions, but cannot commit to pursuing them.

That said, if you believe you could build off this project to create something useful for your community, you don't need to ask our permission; we encourage you to fork the repo and go for it!

## Project Management

We use the Github repository's [Issue tracker](https://github.com/infinite-industries/infinite/issues), but have not always done a good job of keeping the backlog up to date. Before taking on an issue, especially an older one, we encourage reaching out to the team.

We also use Github PRs for reviewing and discussing change requests. Proposals are welcome, but we encourage you to reach out before you start coding -- the project has been around for a while now and we've accumulated a lot of lessons learned about what works and what doesn't, so there may be a reason we don't have the functionality you have in mind.

## Project Overview

This repository is the central source-of-truth for the primary components of the Infinite Industries stack. The repo can be thought of as a monorepo (though it does not use any monorepo-specific tooling). Each subdirectory has a README explaining its purpose, which we endeavor to keep up to date.

For hacking on the project, the three subprojects you will most care about are:

- `api-server/`: source code for the API server that powers everything. This is a NestJS web application that serves JSON, backed by a Postgres database
- `web-portal/`: source code for the Infinite Industries website, https://infinite.industries/. This is a Nuxt (Vue) web application
- `e2e-tests`: End-to-end tests, using Cypress, that require both the web portal and API server to be running. These are also run on CI.

The `ansible`, `containers`, and `ops` subdirectories contain code and configuration for managing the production and staging deploys of the API server and website. `widget` was part of a project to allow partner orgs to embed a live event list in their websites; it is not actively maintained.

## Code Style

Both the web portal and API server use ESLint, though it was added well after development had started and even then we've not always been consistent about enforcing its use. You can run ESLint with `npm run lint` in both directories.

Please do not submit style-only changes without first discussing with the core maintainers.

## Testing

The API server and web portal both have their own test suites; see their respective READMEs and the `scripts` section of their `package.json` files.

Tests for new features and bugfixes are strongly encouraged, but given the gaps in existing test coverage it's hard to enforce. If you're not sure the best way to test something, reach out to the core maintainers.

If you have the server and web portal running locally in dev mode for development, you can safely run the E2E tests against them directly, without blowing up your local database. There are also helper scripts available to stand up a stack from scratch for testing; see the steps in the [E2E test CI workflow](./.github/workflows/cypress-tests.yml).

## Development Environments

The API server and web portal both have instructions for setting up local development. Note that the API server requires a Postgres database. Except for the database, all external services (e.g. Auth0, AWS S3) fall back to local alternatives in dev mode.

The repo contains a [devcontainer](https://containers.dev/) configuration, which stands up the database as a sidecar container. This configuration should be compatible with Github Codespaces. The `docs` subdirectory has some documentation for spinning up a Codespace.
