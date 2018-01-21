const express = require('express');
const router = express.Router();
const { makeAPICall } = require('./utils/requestHelper');
const bodyParser = require('body-parser')

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({
    extended: true
}));


router.get("/:id", function(req, res) {
    const id = req.params.id;

    console.info('event request for "%s"', id);
    makeAPICall('get', 'events/' + id, {}, null, (err, apiResp) => {
        if (err) {
            console.warn('error getting event (%s): %s', id, err);
            res.status(500).send('error getting event');
        } else {
            res.render(
                'event',
                { id, event: apiResp.data.event, site_url: process.env.SITE_URL }
            );
        }
    });
})

router.post("/add", function(req,res){
  console.log("Data recieved: list - "+req.body.list_id+" event - "+req.body.event_id);
  res.json({"status":"success", "id":req.body.event_id})
})

router.post("/remove", function(req,res){
  console.log("Data recieved: list - "+req.body.list_id+" event - "+req.body.event_id);
  res.json({"status":"success", "id":req.body.event_id})
})

module.exports = router;
