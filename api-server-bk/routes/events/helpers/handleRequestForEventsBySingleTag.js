const { literal, Op }  = require('sequelize')

const filterContactInfo = require('./filterContactInfo')
const EventController = require('../../../controllers/events')
const getIncludesForAdditionalEmbeddedChildModels = require('./getIncludesForAdditionalEmbeddedChildModels')
const { logger } = require('../../../utils/loggers')

module.exports = handleRequestForEventsBySingleTag

function handleRequestForEventsBySingleTag(req, res, verified) {
  const tag = req.params.tag
  const db = req.app.get('db')

  const query = {
    where: {
      tags: { [Op.contains]: [tag] }
    },
    order: literal('"createdAt" DESC'),
    include: getIncludesForAdditionalEmbeddedChildModels(req.embed, db)
  }

  if (verified !== null) {
    query.where.verified = verified
  }

  EventController.all(db, (err, events) => {
    if (err) {
      logger.warn('error getting verified events by tag: ' + err);
      return res.status(501).json({ status: 'failed: ' + err });
    }

    filterContactInfo(req, events)

    res.status(200).json({ status: 'success', events });
  }, query)
}