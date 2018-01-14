const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const uuid = require('uuid/v4')
const router = express.Router()
const { makeAPICall } = require('./utils/requestHelper');

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/all', function(req, res) {
  makeAPICall('get','events', null, (err, apiRes) => {
    if (err) {
        console.warn('error retrieving events:' + err);
        res.status(500).json({"error": "error retrieving events: " + err})
    } else {
        console.info('success: ' + req.url);
        res.json({"status":"success", "events": apiRes.data.events });
    }
  });
})


router.get('/:id', function(req, res){
    // get the list
    const id = req.params.id;
    console.info('getting user_list: ' +  id);
    makeAPICall('get', 'event-lists/' + id, null, (err, resAPI) => {
        if (err) {
            console.warn(err);
        } else {
            res.json(resAPI.data.eventList);
        }
    });
})

// router.post('/create-new', function(req, res){
//   // console.log(req.body);
//   req.body.apikey=process.env.API_KEY
//   const call_url=process.env.API_URL+"/event-lists"
//
//   axios.post(call_url, req.body)
//     .then(function (_response) {
//      res.json(_response.data);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
//
// })


router.post('/create-new', function(req, res){
  console.log(req.body)

  res.json({"id":uuid()})
})



module.exports = router;
