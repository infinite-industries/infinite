const express = require('express');
const router = express.Router();
const { makeAPICall } = require('./utils/requestHelper');
const bodyParser = require('body-parser')

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', function(req, res) {
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

	const listID = req.body.list_id;
	const eventID = req.body.event_id;

	console.log("Data received: list - "+ req.body.list_id+" event - " + req.body.event_id);

	makeAPICall('put', 'event-lists/addEvent/' + listID +  '/' + eventID, {}, process.env.API_KEY, (err, apiResp) => {
		res.json(apiResp.data);
	});

    res.json({"status":"success", "id":req.body.event_id})
})

router.post("/remove", function(req,res){
    const listID = req.body.list_id;
    const eventID = req.body.event_id;

    console.log("Data received: list - "+ req.body.list_id+" event - " + req.body.event_id);

    makeAPICall('put', 'event-lists/removeEvent/' + listID +  '/' + eventID, {}, process.env.API_KEY, (err, apiResp) => {
		res.json(apiResp.data);
    });
})

module.exports = router;
