# Infinite Industries Widget

Widget for embedding events from the Infinite Industries platform on a website.

## Installation

- Add an `div` or other element with class `infinite-widget` to your main template where you want to place the widget.
- Add these (optional) attributes to the container element:
  - `data-widget-title`
  - `data-cards-per-page` (controls the number of events that will appear at a time)
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
