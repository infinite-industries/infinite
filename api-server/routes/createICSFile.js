const moment = require('moment-timezone')
const uuidv4 = require('uuid/v4')
const express = require('express')
const router = express.Router()
const { logger } = require(__dirname + '/../utils/loggers')

const projectSettings = {
  calscale: 'GREGORIAN',
  prodid: 'InfiniteIndustries/ics',
  timezone: 'America/New_York'   // need to figure out a more graceful way to deal with timezones
}

moment.tz.setDefault(projectSettings.timezone)

router.get('/', (req, res) => {
  try {
    const title = req.query.title
    const dtStart = req.query.time_start
    const dtEnd = req.query.time_end
    const description = req.query.description
    const location = req.query.location

    const firstMissingField = [
      { key: 'title', val: title },
      { key: 'time_start', val: dtStart },
      { key: 'time_end', val: dtEnd },
      { key: 'description', val: description },
      { key: 'location', val: 'location'}
    ].find(keyVal => keyVal.val === undefined || keyVal.val === null)

    if (firstMissingField) {
      return res.status(400).send(`${firstMissingField.key} is a required field`)
    }

    const icsBody = generateICSFileText(title, dtStart, dtEnd, description, location)

    res.set({
      'Content-type': 'text/calendar',
      'Content-disposition': 'attachment; filename="infinite_event.ics"'
    })

    res
      .status(200)
      .send(icsBody)
  } catch (ex) {
    logger.error(`error generating ics file: ${ex}`)
    res.status(500).send('an error occurred')
  }
})

function generateICSFileText(summary, dtStart, dtEnd, description, location) {
  return ['BEGIN:VCALENDAR',
    'VERSION:2.0',
    `CALSCALE:${projectSettings.calscale}`,
    `PRODID:${projectSettings.prodid}`,
    'METHOD:PUBLISH',
    'X-PUBLISHED-TTL:PT1H',
    'BEGIN:VEVENT',
    `UID:${uuidv4()}`,
    `SUMMARY:${summary}`,
    `DTSTAMP:${moment().utc().format('YYYYMMDDTHHmmss')}Z`,
    `DTSTART:${moment(dtStart).format('YYYYMMDDTHHmmss')}`,
    `DTEND:${moment(dtEnd).format('YYYYMMDDTHHmmss')}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'].join('\n')
}

module.exports = router
