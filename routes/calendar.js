const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const ics = require('ics')
const moment = require('moment')

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', function(req, res){
  // generate an ICS file for iCal and Outlook
  // https://www.npmjs.com/package/ics
  const calendar_entry = ''
  const title = req.query.name
  const file_name = req.query.name + ".ics"
  const description = req.query.description       // TODO sanitize
  const start_time =  moment(req.query.start_time).toArray().slice(0, 5)
  const end_time = moment(req.query.end_time).toArray().slice(0, 5)

  // bump month by one since moment represents months 0-11 and ics 1-12
  start_time[1] = start_time[1]+1
  end_time[1] = end_time[1]+1

  console.log("start:"+start_time+" end:"+end_time)

  ics.createEvent({
    title: title,
    description: description,
    start: start_time ,
    end: end_time,
  }, (error, value) => {
    if (error) {
      console.log(error)
      res.json({"status":"error", "reason":"Unable to generate a calendar file"})
    }
    res.setHeader('Content-disposition', 'attachment; filename='+ file_name)
    res.setHeader('Content-type', 'text/plain')
    res.charset = 'UTF-8'
    res.write(value)
    res.end()

  })


})

module.exports = router;
