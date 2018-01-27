const express = require('express')
const router = express.Router()
const { makeAPICall } = require('./utils/requestHelper')
const bodyParser = require('body-parser')

const slack = require('./utils/slackNotify');

//get configuration file from .env
const dotenv = require('dotenv')
dotenv.load()

const aws = require('aws-sdk')
const util = require('util')
const fs = require('fs')
const uuidv4 = require('uuid/v4')
const multiparty = require('multiparty')


const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


const uploadFile = function(file_name, file_key, file_data, cb) {
  var params = {
    Body: file_data,
    Bucket: process.env.AWS_S3_UPLOADS_BUCKET,
    Key: file_key
  };

  s3.putObject(params, cb);
}

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({
    extended: true
}))

router.post("/submit-new", function(req, res) {
  res.json({"yo":"yo"})
  //slack.Test()
  slack.Notify('test', 'very testing Ari hi')
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
  res.json({"status":"success", "id":req.body.event_id})
})

router.post("/remove", function(req,res){
  console.log("Data recieved: list - "+req.body.list_id+" event - "+req.body.event_id);
  res.json({"status":"success", "id":req.body.event_id})
})

module.exports = router;
