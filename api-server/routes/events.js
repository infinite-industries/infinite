// --- event related API endpoints /events/* ---

/**
 * @swagger
 *
 * definitions:
 *  EventsResponse:
 *    type: object
 *    properties:
 *      status:
 *        type: string
 *        enum: ["success", "failure"]
 *      error_message:
 *        type: string
 *      events:
 *        type: array
 *        items:
 *          $ref: '#definitions/CurrentEvent'
 */

/**
 * @swagger
 *
 * /events/current/verified:
 *  get:
 *    description: Returns a list of all verified events. Currents events are events that are upcoming or less than 24 hours in the past.
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

const slack = require('../utils/slackNotify')
const EventController = require('../controllers/events')
const CurrentEventController = require('../controllers/currentEvents')
const { getDefaultRouter } = require('./helpers/routeHelpers')
const { literal } = require('sequelize')
const JWTAuthenticator = require(__dirname + '/../utils/JWTAuthenticator')
const DatesToISO = require(__dirname + '/middleware/datesToISO')
const axios = require('axios')
const uuidv1 = require('uuid/v1')
const { logger } = require(__dirname + '/../utils/loggers')
const ParseEmbed = require('./middleware/parseEmbeds')

const BITLY_URI ='https://api-ssl.bitly.com/v4/shorten'
const BITLY_TOKEN = process.env.BITLY_TOKEN
const BITLY_BASE = process.env.APP_URL || 'https://infinite.industries'
const env = process.env.ENV || 'dev'

const filterContactInfo = (req, data) => {
  if (req.isInfiniteAdmin) {
    return
  } else if (Array.isArray(data)) {
    data.forEach(item => {
      item.set('organizer_contact', undefined)
    })
  } else if (!!data) {
    data.set('organizer_contact', undefined)
  }
}

const router = getDefaultRouter("events", "event", EventController, { verified: false }, {
  // provides special controller methods for getters to merge data from multiple tables
  allMethod: EventController.allAndMergeWithVenues,
  byIDMethod: EventController.findByIDAndMergeWithVenues,
  createMiddleware: [DatesToISO, createOverride], // anyone can create a new event; Dates will be converted form local to UTC/ISO
  updateMiddleware: [JWTAuthenticator(true)], // requires admin token to update (put)
  readFilter: filterContactInfo // strip contact info
});

// get current non or un-verified events (should first be JWTAuthenticated)
router.get('/current/non-verified',
  [JWTAuthenticator(true), ParseEmbed], // only admin can see non-verified events
  function(req, res) {
    const db = req.app.get('db')

    const query = {
      where: {
        verified: false
      },
      order: literal('first_day_start_time ASC'),
      include: getIncludeBlock(req.embed, db)
    }

    CurrentEventController.all(db, function(err, events) {
      if (err) {
            logger.warn('error getting current/verified events: ' + err);
            return res.status(501).json({ status: 'failed: ' + err });
        }

        res.status(200).json({ status: 'success', events });
    }, query);
});

// get current verified events
router.get('/current/verified', [ParseEmbed], function(req, res) { // anyone can read verified events
  const db = req.app.get('db')

  const query = {
    where: {
      verified: true
    },
    order: literal('first_day_start_time ASC'),
    include: getIncludeBlock(req.embed, db)
  }

  CurrentEventController.all(db, function(err, events) {
    if (err) {
      logger.warn('error getting current/verified events: ' + err);
      return res.status(501).json({ status: 'failed: ' + err });
    }

    filterContactInfo(req, events)

    res.status(200).json({ status: 'success', events });
  }, query);
});

// allows admins to tag an event as verified
router.put(
  '/verify/:id',
    [JWTAuthenticator(true)], // restrict to admin/token
    (req, res) => {
    const id = req.params.id;

        logger.info(`handling request to verify event "${id}"`)

    if (!id)
      return res.status(404).json({ status: 'id is a required field' });

    EventController.update(req.app.get('db'), id, { verified: true }, function(err) {
      if (err)
        return res.status(500).json({ status: 'failed: ' + err });

      res.status(200).json({ status: 'success' });
    });
  }
);

async function createOverride(req, res, next) {
  if (!req.body.event)
    return res.status(422).json({ status: 'event parameter is required' })

  try {
    const id = uuidv1()

    const bitlyLink = await _createBitlyLink(`${BITLY_BASE}/events/${id}`)

    const postJSON = {
      ...req.body.event,
      id,
      bitly_link: bitlyLink,
      slug: _getSlug(req.body.event.title)
    }

    EventController.create(req.app.get('db'), postJSON, async (err) => {
      if (err) {
        const msg = 'error creating "event": ' + err
        logger.error(msg)

        return res.status(500).json({ status: msg })
      }

      res.status(200).json({ status: 'success', id: postJSON.id })

      try {
        slack.Notify('event-submit', `(${env}) Review Me. Copy Me. Paste Me. Deploy Me. Love Me.:\n` +
          JSON.stringify({...postJSON}, null, 4))
      } catch (exSlack) {
        logger.error(`error notifying slack of new event: ${exSlack}`)
      }
    });
  } catch (ex) {
    logger.warn('error calling link shortener: ', ex)
    res.status(500).json({ status: 'error calling link shortener' })
  }
}

async function _createBitlyLink(infiniteUrl) {
  const headers = {
    Authorization: `Bearer ${BITLY_TOKEN}`,
     // this is important; Bitly returns 406 if not explicitly set
    'Content-Type': 'application/json'
  }
  try {
    var response = await axios.post(BITLY_URI, { long_url: infiniteUrl }, { headers })
  } catch (ex) {
    const errors = ex.response && ex.response.data
      ? (ex.response.data.length ? ex.response.data.map(e => e.message).join(', ') : ex.response.data.message)
      : 'n/a'
    logger.error(`Link shortener failed (${ex.response && ex.response.status}: ${errors})`)
    throw new Error('Link shortener failed')
  }

  return response.data && response.data.link ? response.data.link : null
}

function _getSlug(title) {
  if (!title) {
    return 'missing-title'
  }

  return title.toLowerCase().replace(/ /g,'-')
}

function getIncludeBlock(embeds, db) {
  return embeds
    .map(embedStr => {
      return { model: db[embedStr] }
    })
    .filter(entry => entry !== null)
}

module.exports = router;
