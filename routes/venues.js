const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { makeAPICall } = require('./utils/requestHelper');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', (req, res) => {
  console.log("get venues");
  res.json([{name: "venue1"}, {name: "venue2"}, {name: "venue3"}]);
});

module.exports = router;
