# Infinite Industries Widget

[![npm version](https://badgen.net/npm/v/@infinite-industries/widget)](https://www.npmjs.com/package/@infinite-industries/widget)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/@infinite-industries/widget/badge)](https://www.jsdelivr.com/package/npm/@infinite-industries/widget)

Widget for embedding events from the Infinite Industries platform on a website.

## Installation

- Add one or more `div`s or other elements with id `infinite-widget` to your main template where you want to place the widget.
  (note that while duplicate IDs on elements are usually frowned on, the widget has been set up to support it)
- Add these (optional) attributes to the container element(s):
  - `data-widget-title`
  - `data-cards-per-page` (controls the number of events that will appear at a time; use `*` to compute based on the size of the window)
  - `data-rows-per-page` (when using `data-cards-per-page="*"`, controls the number of rows that will be rendered on a page; has no effect when `data-cards-per-page` is a number)
  - `data-event-id` (if set to a valid event ID, will cause the widget to display a single card for that event only)
- Add this script, replacing `1.0` with the version you want to use:

  ```html
  <script src="https://cdn.jsdelivr.net/npm/@infinite-industries/widget@1.0/dist/main.js"></script>
  ```

  and this stylesheet:

  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@infinite-industries/widget@1.0/dist/main.css">
  ```

## Development

The widget source lives in main Infinite Industries repo.

```bash
git clone https://github.com/infinite-industries/infinite.git
cd infinite/widget
npm install
```

`npm run start` runs a webpack dev server with hot reloading, serving at [localhost:8080](http://localhost:8080/). The test page uses the `data-mode` attribute to make the widget pull from the staging API instead of production; you can also set it to `local` to pull from a locally-running API server.

`npm run test` runs the unit tests

`npm run build` to build for production

## License

MIT
