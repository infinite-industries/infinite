/**
 * @swagger
 *
 * /events/current/verified:
 *  get:
 *    description: Returns a list of all verified events. Currents events are events that are upcoming or less than 24 hours in the past. This is an open route for public consumption.
 *    produces: application/json
 *    parameters:
 *      - name: embed
 *        description: |+
 *          Specifies related entities to retrieve as embedded children of the event. For example, events have venues.
 *
 *          Allowed Values -- venue
 *        in: query
 *        required: false
 *        type: array
 *        items:
 *          type: string
 *        enum:
 *          - venue
 *    responses:
 *      200:
 *        description: Success!
 *        schema:
 *          $ref: '#definitions/EventsResponse'
 *      501:
 *        description: There was an error processing the request.
 *        schema:
 *          $ref: '#definitions/EventsResponse'
 *      422:
 *        description: A parameter supplied was not allowed or understood.
 *        schema:
 *          $ref: '#definitions/EventsResponse'
 */

const  { literal } = require('sequelize')
const express = require('express')

const { logger } = require('../../../utils/loggers')
const CurrentEventController = require('../../../controllers/currentEvents')
const { getIncludesForAdditionalEmbeddedChildModels, filterContactInfo} = require('../helpers')
const ParseEmbed = require('../../middleware/parseEmbeds')

const router = express.Router({ mergeParams: true });

router.use([
  ParseEmbed,
  getCurrentVerifiedEvents
])

function getCurrentVerifiedEvents(req, res) {
  const db = req.app.get('db')

  const query = {
    where: {
      verified: true
    },
    order: literal('first_day_start_time ASC'),
    include: getIncludesForAdditionalEmbeddedChildModels(req.embed, db)
  }

  CurrentEventController.all(db, function(err, events) {
    if (err) {
      logger.warn('error getting current/verified events: ' + err);
      return res.status(501).json({ status: 'failed: ' + err });
    }

    filterContactInfo(req, events)

    res.status(200).json({ status: 'success', events });
  }, query)
}

module.exports = router
