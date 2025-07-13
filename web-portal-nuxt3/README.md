# Infinite Industries Portal Web Application

Front-end web application for [Infinite Industries](https://infinite.industries).

## Features

- **TODO**: [refer to Project Page] (https://github.com/infinite-industries/infinite/projects/1)

## Development Environment Setup

### Dependencies

You will need the following tools:

- [Node.js](https://nodejs.org/en/): 20.x.x
- [npm](https://www.npmjs.com/get-npm): 10.x.x

### Recommended

The following tools will make your life easier:

- Vue.js devtools browser extension
  - [Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### Setup

This application communicates with an [API server](https://github.com/infinite-industries/infinite), which you will also need to run. The API server's URL can be configured in the env file.

1. Download the current version of Infinite Industries from GitHub

  ```bash
  git clone https://github.com/infinite-industries/infinite.git
  ```

2. Install dependencies

  ```bash
  cd web-portal-nuxt
  npm install
  ```

3. Set up the env file. Sample files are provided with a `.sample` suffix. A core team member can send you the dev secrets via the Infinite Industries Slack.

 ```bash
 cp .env.sample .env    # main env file
 ```

* The options you choose for your time zone variables should meet three criteria:
  * They should exist in the `name` column of the `pg_timezone_names` table in your PostgreSQL database (which follows the [IANA](https://www.iana.org/time-zones) standard)
  * They should account for daylight savings time changes (if relevant to your time zones)
  * They should make sense to the humans using your website
* The query below demonstrates the time zone options you can choose from that have names starting with `US/`

```
# select * from pg_timezone_names where name like 'US/%' and is_dst order by utc_offset;
       name        | abbrev | utc_offset | is_dst
-------------------+--------+------------+--------
 US/Aleutian       | HDT    | -09:00:00  | t
 US/Alaska         | AKDT   | -08:00:00  | t
 US/Pacific-New    | PDT    | -07:00:00  | t
 US/Pacific        | PDT    | -07:00:00  | t
 US/Mountain       | MDT    | -06:00:00  | t
 US/Central        | CDT    | -05:00:00  | t
 US/Indiana-Starke | CDT    | -05:00:00  | t
 US/Eastern        | EDT    | -04:00:00  | t
 US/East-Indiana   | EDT    | -04:00:00  | t
 US/Michigan       | EDT    | -04:00:00  | t
(10 rows)
```

4. Start the server
 ```bash
 npm run dev
 ```

5. If you have not already done so, start the API server. The API server can also be started prior to the portal server.

6. Point your browser to `http://localhost:7779`

## Building for Production

1. Run the Nuxt build
 ```bash
 npm run build
 ```

2. Start the Nuxt production server
 ```bash
npm run start:dev
 ```

## Running Tests

`npm run test` will run the unit and integration tests.

Cypress end-to-end tests, which require the API server, are in the `e2e-tests` directory at the root of the repository. See the [README](https://github.com/infinite-industries/infinite/tree/master/e2e-tests/README.md) in that directory for further instructions.

## License

MIT
