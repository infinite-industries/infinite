const express = require('express')

const EventController = require('../../../controllers/events')
const { logger } = require('../../../utils/loggers')
const JWTAuthenticator = require('../../../utils/JWTAuthenticator')

const router = express.Router({ mergeParams: true })

router.use([
  JWTAuthenticator(true),
  verifyEventById]
)

function verifyEventById(req, res) {
  const id = req.params.id;
  const db = req.app.get('db')

  logger.info(`handling request to verify event "${id}"`)

  if (!id)
    return res.status(404).json({ status: 'id is a required field' });

  EventController.update(db, id, { verified: true }, function(err) {
    if (err)
      return res.status(500).json({ status: 'failed: ' + err });

    res.status(200).json({ status: 'success' });
  });
}

module.exports = router
