// event related API endpoints
const EventController = require('../controllers/events')
const CurrentEventController = require('../controllers/currentEvents')
const { getDefaultRouter } = require('./helpers/routeHelpers')
const { literal } = require('sequelize')
const JWTAuthenticator = require(__dirname + '/../utils/JWTAuthenticator')
const DatesToISO = require(__dirname + '/middleware/datesToISO')

const router = getDefaultRouter("events", "event", EventController, { verified: false }, {
    // provides special controller methods for getters to merge data from multiple tables
    allMethod: EventController.allAndMergeWithVenues,
	byIDMethod: EventController.findByIDAndMergeWithVenues,
	createMiddleware: [DatesToISO], // anyone can create a new event; Dates will be converted form local to UTC/ISO
  	updateMiddleware: [JWTAuthenticator(true)] // requires admin token to update (put)
});

// get current non or un-verified events
router.get('/current/non-verified',
  [JWTAuthenticator(true)], // only admin can see non-verified events
  function(req, res) {
		const query = {
			where: {
				verified: false
			}
		}

		//query.where.time_end[Op.gte] = dt
    //const query = { $and: [{ time_end: { $gt: dt }}, { verified: { $ne: true }}] };
    CurrentEventController.all(req.app.get('db'), function(err, events) {
    	if (err) {
            console.warn('error getting current/verified events: ' + err);
            return res.status(501).json({ status: 'failed: ' + err });
        }

        res.status(200).json({ status: 'success', events });
    }, query);
});

// get current verified events
router.get('/current/verified',
  function(req, res) { // anyone can read verified events
	const query = {
		where: {
		  verified: true
		},
	  	order: literal('start_time ASC')
	}

	CurrentEventController.all(req.app.get('db'), function(err, events) {
		if (err) {
			console.warn('error getting current/verified events: ' + err);
			return res.status(501).json({ status: 'failed: ' + err });
		}

		res.status(200).json({ status: 'success', events });
	}, query);
});

// allows admins to tag an event as verified
router.put(
	'/verify/:id',
  	[JWTAuthenticator(true)], // restrict to admin/token
  	(req, res) => {
		const id = req.params.id;

        console.log(`handling request to verify event "${id}"`)

		if (!id)
			return res.status(404).json({ status: 'id is a required field' });

		EventController.update(req.app.get('db'), id, { verified: true }, function(err) {
			if (err)
				return res.status(500).json({ status: 'failed: ' + err });

			res.status(200).json({ status: 'success' });
		});
	}
);

module.exports = router;
