// event related API endpoints
const VenueController = require("../controllers/venues");
const { getDefaultRouter } = require("./helpers/routeHelpers");
const router = getDefaultRouter("venues", "venue", VenueController, {}, {
    createMiddleware: [], // anyone can create a new venue

});

module.exports = router;
