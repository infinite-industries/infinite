const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const router = express.Router();

router.use(bodyParser.json());

router.get('/', function(req, res){
  //
})

router.post('/create-new', function(req, res){
  // console.log(req.body);
  req.body.apikey=process.env.API_KEY
  const call_url=process.env.API_URL+"/event-lists"

  axios.post(call_url, req.body)
    .then(function (_response) {
     res.json(_response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

})

module.exports = router;
