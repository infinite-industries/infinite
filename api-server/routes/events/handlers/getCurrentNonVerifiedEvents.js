const { literal } = require('sequelize')
const express = require('express')

const JWTAuthenticator = require('../../../utils/JWTAuthenticator')
const CurrentEventController = require('../../../controllers/currentEvents')
const { getIncludesForAdditionalEmbeddedChildModels } = require('../helpers')
const { logger } = require('../../../utils/loggers')
const ParseEmbed = require('../../middleware/parseEmbeds')

const router = express.Router({ mergeParams: true })

router.use([
  JWTAuthenticator(true),
  ParseEmbed,
  getCurrentNonVerifiedEvents]
)

function getCurrentNonVerifiedEvents(req, res) {
  const db = req.app.get('db')

  const query = {
    where: {
      verified: false
    },
    order: literal('first_day_start_time ASC'),
    include: getIncludesForAdditionalEmbeddedChildModels(req.embed, db)
  }

  CurrentEventController.all(db, function (err, events) {
    if (err) {
      logger.warn('error getting current/verified events: ' + err);
      return res.status(501).json({status: 'failed: ' + err});
    }

    res.status(200).json({status: 'success', events});
  }, query)
}

module.exports = router
