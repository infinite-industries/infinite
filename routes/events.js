const express = require('express')
const router = express.Router()
const { makeAPICall } = require('./utils/requestHelper')
const bodyParser = require('body-parser')
const sanitizer = require('sanitizer');

const slack = require('./utils/slackNotify')
const Event = require('./utils/event')

//get configuration file from .env
const dotenv = require('dotenv')
dotenv.load()

const aws = require('aws-sdk')
const util = require('util')
const fs = require('fs')
const uuidv4 = require('uuid/v4')
const multiparty = require('multiparty')

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({
    extended: true
}))


const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


const UploadFile = function(file_name, file_key, file_data, cb) {
  var params = {
    Body: file_data,
    Bucket: process.env.AWS_S3_UPLOADS_BUCKET,
    Key: file_key
  };

  s3.putObject(params, cb);
}

const ManageUpload = function (id, path, type, cb){
  console.log("uploading "+type+" image ---"+path)
  cb()
}



router.post("/submit-new", function(req, res) {

  const form = new multiparty.Form();

   form.parse(req, function(err, fields, files) {
     console.log(util.inspect({fields: fields, files: files}))

     const EVENT = new Event({
       id: fields.id[0],
       title: fields.title[0],
       slug: fields.title[0].toLowerCase().replace(/ /g,"-")

     })

     // console.log(EVENT.id);

     if(Object.keys(files).length > 0){
       if(files.hasOwnProperty('social_image')){
         ManageUpload(EVENT.id, files.social_image[0].path, "social", function(err, data){
           // if(err){
           //   res.json({"status":"failure", "reason": err})
           // }
           // else{
           //   res.json({"status":"success"})
           // }
         })
       }
       if(files.hasOwnProperty('image')){
         ManageUpload(EVENT.id, files.image[0].path, "hero", function(err, data){
           // if(err){
           //   res.json({"status":"failure", "reason": err})
           // }
           // else{
           //   res.json({"status":"success"})
           // }
         })
       }
     }
   })

  res.json({"yo":"yo"})
  // slack.Test()
  // slack.Notify('test', 'very testing Ari hi')
})

router.post("/promo-new", function(req, res) {
  res.json({"yo":"yo"})

  // mail to UKY address to figure out email weirdness

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
