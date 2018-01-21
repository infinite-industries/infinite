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
  const title = req.query.title
  const file_name = req.query.title + ".ics"
  const location = req.query.location
  const description = req.query.description       // TODO sanitize
  const time_start =  moment(req.query.time_start).toArray().slice(0, 5)
  const time_end = moment(req.query.time_end).toArray().slice(0, 5)

  // bump month by one since moment represents months 0-11 and ics 1-12
  time_start[1] = time_start[1]+1
  time_end[1] = time_end[1]+1

  ics.createEvent({
    title: title,
    description: description,
    location: location,
    start: time_start,
    end: time_end,
  }, (error, value) => {
    if (error) {
      console.log(error)
      res.json({"status":"error", "reason":"Unable to generate a calendar file"})
    } else {
      res.setHeader('Content-disposition', 'attachment; filename="'+ file_name + '"')
      res.setHeader('Content-type', 'text/plain')
      res.charset = 'UTF-8'
      res.write(value)
      res.end()
    }
  })


})

module.exports = router;
