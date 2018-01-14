const express = require('express');
const router = express.Router();
const { makeAPICall } = require('./utils/requestHelper');

router.get("/:id", function(req, res) {
    const id = req.params.id;

    console.info('event request for "%s"', id);
    makeAPICall('get', 'events/' + id, null, (err, apiResp) => {
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
  res.json({"got":"it"})
})



module.exports = router;
