const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { makeAPICall } = require('./utils/requestHelper');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/:id', function(req, res) {
  const fakeUserID = '99af7550-f3e6-11e7-8279-f30c6795f584';
  console.info('handling request for user data "%s"', fakeUserID);
  makeAPICall('get', 'users/' + fakeUserID, process.env.API_KEY, (err,apiResp) => {
    if (err) {
      console.warn(err);
      res.status(500).json({ status: 'error getting user data'});
    } else {
      res.json(apiResp.data.user);
    }
  });
});

module.exports = router;
