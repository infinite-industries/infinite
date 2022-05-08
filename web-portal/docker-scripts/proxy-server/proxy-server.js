/*
  we need to allow the api to be hit both client side where it will be exposed on local host and
  within the stack where it will be exposed via the service names

  This is needed for serer side rendering. This simple proxy server should do the trick
 */

const express = require('express');
const { createProxyMiddleware } =  require('http-proxy-middleware');

const PORT = 3003 || process.env.API_LOCAL_PORT;
const API_HOST = `http://api-server:${PORT}`;

const server = express();

server.use(createProxyMiddleware({
  target: API_HOST,
  changeOrigin: true
}));

server.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  else {
    console.info(`server ready @ http://localhost:${PORT}`);
  }
});
