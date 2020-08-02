const moment = require('moment-timezone')
const uuidv4 = require('uuid/v4')

const icsFileSettings = require('./icsFileSettings')

moment.tz.setDefault(icsFileSettings.timezone)

function generateICSFileText(summary, dtStart, dtEnd, description, location) {
  return ['BEGIN:VCALENDAR',
    'VERSION:2.0',
    `CALSCALE:${icsFileSettings.calscale}`,
    `PRODID:${icsFileSettings.prodid}`,
    'METHOD:PUBLISH',
    'X-PUBLISHED-TTL:PT1H',
    'BEGIN:VEVENT',
    `UID:${uuidv4()}`,
    `SUMMARY:${summary}`,
    `DTSTAMP:${moment().utc().format('YYYYMMDDTHHmmss')}Z`,
    `DTSTART:${moment(dtStart).format('YYYYMMDDTHHmmss')}`,
    `DTEND:${moment(dtEnd).format('YYYYMMDDTHHmmss')}`,
    `DESCRIPTION:${description}`,
    location ? `LOCATION:${location}` : '',
    'END:VEVENT',
    'END:VCALENDAR'].filter(l => !!l).join('\n')
}

module.exports = generateICSFileText
