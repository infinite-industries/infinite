// event related API endpoints

const slack = require('../utils/slackNotify')

const EventController = require('../controllers/events')
const CurrentEventController = require('../controllers/currentEvents')
const VenueController = require('../controllers/venues')

const { getDefaultRouter } = require('./helpers/routeHelpers')
const { literal } = require('sequelize')
const JWTAuthenticator = require(__dirname + '/../utils/JWTAuthenticator')
const DatesToISO = require(__dirname + '/middleware/datesToISO')
const axios = require('axios')
const uuidv1 = require('uuid/v1')
const ParseEmbed = require('./middleware/parseEmbeds')
const { logger } = require(__dirname + '/../utils/loggers')

const BITLY_URI ='https://api-ssl.bitly.com/v3/shorten'
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

	let controllerMethod = 'all'

	const query = {
		where: {
		  verified: true
		},
		order: literal('start_time ASC'),
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

		CurrentEventController.create(req.app.get('db'), postJSON, async (err) => {
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
	const requestUrl = `${BITLY_URI}?access_token=${BITLY_TOKEN}&longUrl=${encodeURI(infiniteUrl)}`

	const { data } = await axios.get(requestUrl)


	if (data.status_code != 200) {
		throw new Error(`Status ${ data.status_code } returned from link shortener`)
	} else {
		return data.data.url
	}
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
