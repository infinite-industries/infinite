const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const router = express.Router();

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/:id', function(req, res){
  // get the list
  console.log(req.params.id);
  axios.get(process.env.SITE_URL+'/mock_another_user_list_1.json')
  .then(function (_response) {
    res.json(_response.data)
  })
  .catch(function (error) {
    console.log(error);
    res.json({"status":"error getting user data"})
  });
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
