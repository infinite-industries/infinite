const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const ics = require('ics')

router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', function(req, res){
  // generate an ICS file for iCal and Outlook
  // https://www.npmjs.com/package/ics
  const calendar_entry = ''
  const file_name = req.query.name + ".ics"

  ics.createEvent({
    title: req.query.name,
    description: req.query.description,
    start: [2018, 1, 15, 6, 30],
    duration: { minutes: 50 }
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
