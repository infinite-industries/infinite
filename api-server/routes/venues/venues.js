// event related API endpoints
const VenueController = require("../../controllers/venues");
const { getDefaultRouter } = require("../helpers/routeHelpers");
const slack = require('../../utils/slackNotify')
const { logger } = require('../../utils/loggers')
const env = process.env.ENV || 'dev'

const router = getDefaultRouter("venues", "venue", VenueController, {}, {
    createMiddleware: [], // anyone can create a new venue
    createAfterMethod: (req, responseData) => {
        try {
            slack.Notify('venue-submit', `(${env}) New venue created:\n` +
              JSON.stringify({ ...req.body.venue, id: responseData.id }, null, 4))
        } catch (ex) {
            logger.error('error notifying slack for new-venue: ' + ex)
        }

    }
});

module.exports = router;
