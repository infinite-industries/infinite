const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const { makeAPICall } = require('./utils/requestHelper')
const slack = require('./utils/slackNotify')

const Venue = require('./utils/venue')

router.use(bodyParser.urlencoded({
  extended: true
}))

router.get('/', (req, res) => {
  makeAPICall('get', 'venues', {}, process.env.API_KEY, req.token, (err, apiResp) => {
    if (err) {
      console.warn(err)
      res.status(500).json({ status: 'error getting venues'})
    } else {
      res.json(apiResp.data)
    }
  })
})

router.get('/:id', (req, res) => {
  makeAPICall('get', `venues/${req.params.id}`, {}, process.env.API_KEY, req.token, (err, apiResp) => {
    if (err) {
      console.warn(err)
      res.status(500).json({ status: 'error getting venue'})
    } else {
      res.json(apiResp.data)
    }
  })
})

router.post('/submit-new', (req, res) => {

  let new_venue = new Venue(req.body)

  makeAPICall('post', 'venues/', { venue: new_venue }, process.env.API_KEY, req.token, (err, apiResp) => {
    if (err) {
      console.warn(err)
      res.status(500).json({ status: 'error creating venue' })
    } else {
      console.info('venue created')
      new_venue.id = apiResp.data.id
      slack.Notify('venue-submission', 'New venue created:\n' + JSON.stringify(new_venue, null, 4))
      // don't return API response because it only includes the ID, and client expects the whole venue
      res.status(201).json({ status: 'success', venue: new_venue })
    }
  })
})

module.exports = router
