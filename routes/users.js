const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require('axios');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/:id', function(req, res){
  // get the full set of data belonging to the user
  console.log(req.params.id);
  axios.get(process.env.SITE_URL+'/mock_user_data.json')
  .then(function (response) {
    res.json(response.data)
  })
  .catch(function (error) {
    console.log(error);
    res.json({"status":"error getting user data"})
  });
})

module.exports = router;
