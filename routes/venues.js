const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { makeAPICall } = require('./utils/requestHelper');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', (req, res) => {
  console.log("GET VENUES!!!!!!!!!!!!!!!!");
  makeAPICall('get', 'venues', {}, process.env.API_KEY, (err, apiResp) => {
    if (err) {
      console.warn(err);
      res.status(500).json({ status: 'error getting venues'});
    } else {
      res.json(apiResp.data);
    }
  })
});

module.exports = router;
