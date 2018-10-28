const express = require('express')
const router = express.Router()
const async = require('async')
const { makeAPICall } = require('./utils/requestHelper')
const bodyParser = require('body-parser')

const moment = require('moment')

const { notify } = require('./utils/event')

//get configuration file from .env
const dotenv = require('dotenv')
dotenv.load()

const aws = require('aws-sdk')
const util = require('util')
const fs = require('fs')
const uuidv4 = require('uuid/v4')
const multiparty = require('multiparty')
const request = require('request')

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
  fs.readFile(path, function (err,data) {
    if(err){ cb(err, null) }

    const base64file = new Buffer(data,'binary')
    let file_name = id
    let file_key = "uploads"

    if(type === "social"){
      file_name = file_name + "_social.jpg"
      file_key = file_key + "/social/" + file_name
    }
    else if(type === "hero"){
      file_name = file_name + ".jpg"
      file_key = file_key + "/" + file_name
    }
    else{ //just in case we will have other image types at later point
      file_name = file_name + ".jpg"
      file_key = file_key + "/" + file_name
    }

    UploadFile(file_name, file_key, base64file, function(err, data){
      if(err) {
        cb(err, null)
      }
      else{
        console.log(data);
        cb(null, data)
      }
    })
  })
}

const AddBitlyLink = function(id, bitly_token, cb){
  const bitly_query_url ="https://api-ssl.bitly.com/v3/shorten?access_token=" + bitly_token + "&longUrl=" + encodeURI('https://infinite.industries/event/'+id)
  request(bitly_query_url, function(error, response, body) {
    if(!error && response.statusCode == 200){
      // Bitly throws status codes into the body *shrug*
      const bitly = JSON.parse(body)
      if(bitly.status_code == 200 && bitly.status_txt === "OK"){
        cb(null, bitly.data.url)
      }
      else{
        cb({reason:bitly.status_txt}, null)
      }
    }
    else{
      cb({reason:"connection issues"}, null)
    }
  })
}

router.get('/', function(req, res) {
  // get all current verified events
  makeAPICall('get','events/current/verified/', {}, null, req.token, (err, apiRes) => {
    if (err) {
      console.warn('error retrieving events:' + err);
      res.status(500).json({"error": "error retrieving events: " + err})
    } else {
      console.info('success: ' + req.url);
      res.json({"status":"success", "events": apiRes.data.events });
    }
  });
})


router.post("/submit-new", function(req, res){

  const form = new multiparty.Form();

   form.parse(req, function(err, fields, files) {

    // console.log(util.inspect({fields: fields, files: files}))
    // console.log("---------- Object in ------ \n")
    // console.log(JSON.parse(fields.event_data[0]))
    // console.log("-------------")

    async.waterfall([

      // Begin creation of Event object
      function _parseRequest(callback){
        try {
          const eventSeed = JSON.parse(fields.event_data[0])
          const event = {
            ...eventSeed,
            id: uuidv4(),
            slug: eventSeed.title && eventSeed.title.toLowerCase().replace(/ /g,"-")
          }

          callback(null, event)
        } catch (ex) {
          console.warn('error parsing request: ' + ex)
          callback(ex)
        }
      },

      // If social media ready image present, upload it to S3
      function(event, callback){
        if((Object.keys(files).length > 0)&&(files.hasOwnProperty('social_image'))){
          ManageUpload(event.id, files.social_image[0].path, "social", function(err){
            event.social_image = process.env.AWS_SERVER_URL + process.env.AWS_S3_UPLOADS_BUCKET +"/uploads/social/"+event.id+"_social.jpg"
            callback(err, event)
          })
        }
        else {
          callback(null, event)
        }
      },

      // If hero image present, upload it to S3
      function(event, callback){
        if((Object.keys(files).length > 0)&&(files.hasOwnProperty('image'))){
          ManageUpload(event.id, files.image[0].path, "hero", function(err, data){
            event.image = process.env.AWS_SERVER_URL + process.env.AWS_S3_UPLOADS_BUCKET +"/uploads/"+event.id+".jpg"
            callback(err, event)
          })
        }
        else {
          callback(null, event)
        }
      },

      // Create and add bitly link
      function(event, callback){
        console.log('adding bitly link')
        AddBitlyLink(event.id, process.env.BITLY_TOKEN, function(err, data){
          // console.log(data)
          event.bitly_link = data
          callback(err, event)
        })
      },
      // Post as UNVERIFIED to DB and
      // Notify (via Slack) that this needs review
      function(event, callback) {
        console.info('sending new un-verified event to the api')
        makeAPICall('post', 'events/', { event }, process.env.API_KEY, req.token, (err, apiResp) => {
          if (err)
            return callback(err)
          if (apiResp.data.status !== 'success')
            return callback('failure returned from api: ' + apiResp.data.status)

          console.info('api received the event')

          notify(event)
          callback(null, event)
        })
      }

    ], function(err, event){
          // throw me an error
            if(err){
              console.log(err)
              res.status(500).json({"status":"failure", "reason": err})
            }
            else{
            // Generate a quick report back to the client
            // Prep data for additional postings by venues
              console.log(event)
              res.json({ status:"success", data: event })
            }
          }
    )
  })
})


router.post("/promo-new", function(req, res) {
  res.json({"yo":"yo"})

  // mail to UKY address to figure out email weirdness

})

router.get('/data/:id', (req, res) => {
  const id = req.params.id

  console.info(`event data request for ${id}`)
  makeAPICall('get', 'events/' + id, {}, null, req.token, (err, apiResp) => {
    if (err) {
      console.warn(`error getting event (${id}): ${err}`)
      res.status(500).send('error getting event')
    } else {
      res.json(apiResp.data)
    }
  })
})

router.get("/:id", function(req, res) {
    const id = req.params.id;

    console.info('event request for "%s"', id);
    makeAPICall('get', 'events/' + id, {}, null, req.token, (err, apiResp) => {
        if (err) {
            console.warn('error getting event (%s): %s', id, err);
            res.status(500).send('error getting event');
        } else {
          // precompute when_date and when_time values
          let ii_event = {
            ...apiResp.data.event,
            when_date: moment(apiResp.data.event.time_start).format('dddd, MMMM Do'),
            when_time: moment(apiResp.data.event.time_start).format('h:mma') + " - " + moment(apiResp.data.event.time_end).format('h:mma')
          }
          console.log(ii_event);
          res.render(
                'event',
                { id,
                  event: ii_event,
                  site_url: process.env.SITE_URL
                }
            );
        }
    });
})

router.post("/add", function(req,res){
  console.log("Data recieved: list - "+req.body.list_id+" event - "+req.body.event_id);

	const listID = req.body.list_id;
	const eventID = req.body.event_id;

	console.log("Data received: list - "+ req.body.list_id+" event - " + req.body.event_id);

	makeAPICall('put', 'event-lists/addEvent/' + listID +  '/' + eventID, {}, process.env.API_KEY, req.token, (err, apiResp) => {
		res.json(apiResp.data);
	});
})

router.post("/remove", function(req,res){
    const listID = req.body.list_id;
    const eventID = req.body.event_id;

    console.log("Data received: list - "+ req.body.list_id+" event - " + req.body.event_id);

    makeAPICall('put', 'event-lists/removeEvent/' + listID +  '/' + eventID, {}, process.env.API_KEY, req.token, (err, apiResp) => {
		res.json(apiResp.data);
    });
})

module.exports = router
