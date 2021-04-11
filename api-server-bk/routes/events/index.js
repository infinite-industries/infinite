// --- event related API endpoints /events/* ---

const EventController = require('../../controllers/events')
const { getDefaultRouter } = require('../helpers/routeHelpers')
const DatesToISO = require('../middleware/datesToISO')
const JWTAuthenticator = require('../../utils/JWTAuthenticator')
const getCurrentVerifiedEvents = require('./handlers/getCurrentVerifiedEvents')
const getCurrentNonVerifiedEvents = require('./handlers/getCurrentNonVerifiedEvents')
const getAllEventsBySingleTag = require('./handlers/getBySingleTag/getAllEventsBySingleTag')
const getVerifiedEventsBySingleTag = require('./handlers/getBySingleTag/getVerifiedEventsBySingleTag')
const getNonVerifiedEventsBySingleTag = require('./handlers/getBySingleTag/getNonVerifiedEventsBySingleTag')
const verifyEventById = require('./handlers/verifyEventById')
const postCreateEventOverride = require('./defaultCrudOverrides/postCreateEventOverride')
const { filterContactInfo } = require('./helpers')

const router = getDefaultRouter("events", "event", EventController, { verified: false }, {
  // provides special controller methods for getters to merge data from multiple tables
  allMethod: EventController.allAndMergeWithVenues,
  byIDMethod: EventController.findByIDAndMergeWithVenues,
  createMiddleware: [DatesToISO, postCreateEventOverride], // anyone can create a new event; Dates will be converted form local to UTC/ISO
  updateMiddleware: [JWTAuthenticator(true)], // requires admin token to update (put)
  deleteMiddleware: [JWTAuthenticator(true)],
  readFilter: filterContactInfo // strip contact info
})

// get current non or un-verified events (should first be JWTAuthenticated; only for admin)
router.get('/current/non-verified', [getCurrentNonVerifiedEvents])
router.use('/current/verified', [getCurrentVerifiedEvents])
router.get('/non-verified/tags/:tag', [getNonVerifiedEventsBySingleTag])
router.get('/tags/:tag', [getAllEventsBySingleTag])
router.get('/verified/tags/:tag', [getVerifiedEventsBySingleTag])
router.put('/verify/:id', [verifyEventById])

module.exports = router;
