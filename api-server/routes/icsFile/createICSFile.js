const generateICSFileText = require('./helpers/generateICSFileText')
const express = require('express')
const router = express.Router()
const { logger } = require('../../utils/loggers')

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
      { key: 'description', val: description }
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
    logger.error(`error generating ics file: ${ex}\n ${ex.stack}`)
    res.status(500).send('an error occurred')
  }
})

module.exports = router
