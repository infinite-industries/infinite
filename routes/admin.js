const express = require('express');
const router = express.Router();
const axios = require('axios')
const bodyParser = require('body-parser')

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({
    extended: true
}));

// List unverified non-expired events
router.get('/list-unverified', function(req, res){
  //
  const self = this;
  axios.get(process.env.SITE_URL+'/mock_unverified_list.json')
  .then(function (_response) {
    res.json({"status":"success", "events":_response.data})
  })
  .catch(function (error) {
    console.log(error);
    res.json({"status":"failure", "reason":"unable to aquire event data"})
  });
})

// Get specific unverified event info
router.get('/show-event', function(req, res){
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
})

// Update specific event info
router.post('/update-event', function(req, res){
  //
  let event_id = req.body.event_id
  res.json({"status":"success", "event":event_id})
})

// Delete specific event
router.post('/delete-event', function(req, res){
  //
  let event_id = req.body.event_id
  res.json({"status":"success", "event":event_id})
})

// Verify specific event
router.post('/verify-event', function(req, res){
  //
  let event_id = req.body.event_id
  res.json({"status":"success", "event":event_id})
})

module.exports = router;
