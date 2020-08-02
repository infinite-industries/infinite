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
