const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const { makeAPICall } = require('./utils/requestHelper');

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/all', function(req, res) {
  makeAPICall('get','events', {}, null, (err, apiRes) => {
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
    makeAPICall('get', 'event-lists/' + id, {}, null, (err, resAPI) => {
        if (err) {
            console.warn(err);
        } else {
            res.json(resAPI.data);
        }
    });
});

/*router.post('/create-new', function(req, res){
    console.log(req.body)
;
    makeAPICall('post', 'event-lists/', req.body, process.env.API_KEY, (err, resAPI) => {
        if (err) {
            console.warn(err);
        } else {
            res.json(resAPI.data);
        }
    });
});*/

router.post('/create-new', function(req, res){
    console.log(req.body)

    res.json({"status":"success","id":uuid()})
})


module.exports = router;
