const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { makeAPICall } = require('./utils/requestHelper');
const uuidv4 = require('uuid/v4')
const slack = require('./utils/slackNotify')

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
  new_venue.id = uuidv4();
  new_venue.approved = false;
  console.log(new_venue);
  // TODO: instead of slack notify, actually put this into the database using makeAPICall
  slack.Notify("test", "New Venue:\n" + JSON.stringify(new_venue));
  res.json({status: "success", venue: new_venue });
})

module.exports = router;
