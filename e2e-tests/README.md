# Infinite Industries End-to-End Tests

End-to-end / integration tests for [Infinite Industries](https://infinite.industries).

## Dependencies

- [Node.js](https://nodejs.org/en/): 8.9.4 or higher
- [npm](https://www.npmjs.com/get-npm): 5.6.0 or higher

## Setup

1. Install dependencies

  ```bash
  cd e2e-tests
  npm install
  ```

2. Set up the `cypress.env.json` file. A sample file is provided with a `.sample` suffix. A core team member can provide you with the values.

  ```bash
  cp cypress.env.json.sample cypress.env.json
  ```

3. Start the API server and web portal. See the instructions in the [`api-server`](https://github.com/infinite-industries/infinite/tree/master/api-server/README.md) and [`web-portal`](https://github.com/infinite-industries/infinite/blob/master/web-portal/README.md) readmes. The API server and web portal can be started in either dev or prod modes.

  If necessary you can run `npm run db:refresh:it` from inside the `api-server` directory to initialize the database for testing (**WARNING**: this will erase data in your db)

4. Launch the Cypress UI with

  ```bash
  npm run start:dev
  ```

5. Run Cypress headless with

  ```bash
  npm run start
  ```

## License

MIT
