const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const uuid = require('uuid/v4')
const router = express.Router()

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/all', function(req, res){
  // general event listings for the user's area
  axios.get(process.env.SITE_URL+'/event-listings.json')
    .then(function(response){

      res.json({"status":"success", "events":response.data});
      // console.log(response.data);
    })
    .catch(function (error) {
      console.log(error)
      res.status(500).json({"error": "error retreiving events: " + error})
    });
})


router.get('/:id', function(req, res){
  // get the list
  console.log(req.params.id)
  axios.get(process.env.SITE_URL+'/mock_another_user_list_1.json')
  .then(function (_response) {
    res.json(_response.data)
  })
  .catch(function (error) {
    console.log(error);
    res.json({"status":"error getting user data"})
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
