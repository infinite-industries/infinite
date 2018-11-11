const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
//const ics = require('ics')
const uuidv4 = require('uuid/v4')
const moment = require('moment-timezone')

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', function(req, res){
  // generate an ICS file for iCal and Outlook

  const file_name = req.query.title + ".ics"

  let cal_content =
`BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:InfiniteIndustries/ics
METHOD:PUBLISH
X-PUBLISHED-TTL:PT1H
BEGIN:VEVENT
UID:${uuidv4()}
SUMMARY:${req.query.title}
DTSTAMP:${moment().utc().format('YYYYMMDDTHHmmss')}Z
DTSTART:${moment.tz(req.query.time_start, "America/New_York").utc().format('YYYYMMDDTHHmmss')}Z
DTEND:${moment.tz(req.query.time_end, "America/New_York").utc().format('YYYYMMDDTHHmmss')}Z
DESCRIPTION:${req.query.description}
LOCATION:${req.query.location}
END:VEVENT
END:VCALENDAR`


  console.log(req.query.time_start +"\n ------- \n")
  console.log("req:"+req.query.time_start+" utc:"+moment(req.query.time_start).utc().format('YYYYMMDDTHHmmss'))
  console.log(req.query.time_start +"\n ------- \n")
  console.log(cal_content)

  res.setHeader('Content-disposition', 'attachment; filename="'+ file_name + '"')
  res.setHeader('Content-type', 'text/calendar')
  res.charset = 'UTF-8'
  res.write(cal_content)
  res.end()


})

module.exports = router;
