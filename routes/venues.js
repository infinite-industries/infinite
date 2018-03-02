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

router.post('/submit-new', (req, res) => {
  let new_venue = req.body;
  new_venue.approved = false;
  console.log(new_venue);
  setTimeout( () => {
    res.json({ success: true });
  }, 1000);
})

module.exports = router;
