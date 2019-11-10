// event related API endpoints
const VenueController = require("../controllers/venues");
const { getDefaultRouter } = require("./helpers/routeHelpers");
const slack = require('../utils/slackNotify')

const router = getDefaultRouter("venues", "venue", VenueController, {}, {
    createMiddleware: [], // anyone can create a new venue
    createAfterMethod: (req, responseData) => {
        try {
            slack.Notify('venue-submission', 'New venue created:\n' +
              JSON.stringify({ ...req.body.venue, id: responseData.id }, null, 4))
        } catch (ex) {
            console.error('Error notifying slack for new-venue: ' + ex)
        }

    }
});

module.exports = router;
