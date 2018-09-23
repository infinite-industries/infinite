const express = require('express');
const jwtAuthenticator = require(__dirname + '/utils/jwtAuthenticator')
const JWTParser = require(__dirname + '/utils/JWTParser')
const router = express.Router();
const axios = require('axios')
const bodyParser = require('body-parser')
const {makeAPICall} = require('./utils/requestHelper')

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({
    extended: true
}));

// List unverified non-expired events
router.get('/list-unverified', [jwtAuthenticator()], function(req, res) {
  makeAPICall('get', 'events/all/non-verified', {}, null, req.token, (err, apiRes) => {
    if (err) {
      console.warn('error retrieving events:' + err);
      res.status(500).json({"error": "error retrieving events: " + err})
    } else {
      console.info('success: ' + req.url + "\n events returned: " + JSON.stringify(apiRes.data, null, 4));
      res.json({"status": "success", "events": apiRes.data.events});
    }
  })
})

// Get specific unverified event info (CAW => Just use /events/:id)
/*router.get('/show-event', function(req, res){
  //
  const self = this;
  axios.get(process.env.SITE_URL+'/mock_unverified_event.json')
  .then(function (_response) {
    res.json({"status":"success", "event":_response.data})
  })
  .catch(function (error) {
    console.log(error);
    res.json({"status":"failure", "reason":"unable to aquire event data"})
  });
})*/

// Update specific event info
router.post('/update-event', [jwtAuthenticator()], function(req, res){
  const id = req.body.id
  const event = req.body.data

  console.log(`handling request for update-event "${id}"`)
  makeAPICall('put', `events/${id}`, { event }, process.env.API_KEY, req.token, err => {
    if (err) {
      return res.status(500).json({status: 'fail', error: err})
    }

    res.json({ status: 'success', id })
  })
})

// Delete specific event
router.post('/delete-event', [jwtAuthenticator()], function(req, res){
  let id = req.body.id
  console.log('sending delete event', req.token);
  makeAPICall('delete', `events/${id}`, null, process.env.API_KEY, req.token, err => {
    if (err)
      return res.status(500).json({ status: 'fail', error: err })

    res.status(200).json({ status: 'success', id })
  })
})

// Verify specific event
router.post('/verify-event/:id', [jwtAuthenticator()], (req, res) => {
  const id = req.params.id
  console.log(`handling request to verify event "${id}"`)
  makeAPICall('put', `events/verify/${id}`, {}, process.env.API_KEY, req.token, err => {
    if (err)
      return res.status(500).json({ status: 'fail', error: err })

    res.status(200).json({ status: 'success', id })
  })
})

module.exports = router;
