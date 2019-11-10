// event related API endpoints
const EventListController = require("../controllers/eventLists");
const JWTAuthenticator = require(__dirname + '/../utils/JWTAuthenticator')

// requires an authenticated user, but not admin
const JWTAuthChain = [JWTAuthenticator(false)]

const constants = {
	db_error: "db_fail",
	success_status: "success"
};
const { getDefaultRouter } = require("./helpers/routeHelpers");
const router = getDefaultRouter("eventLists", "eventList", EventListController, { verified: false }, {
    // provides special controller methods for getters to merge data from multiple tables
	allMethod: EventListController.allAndMergeWithEvents,
	byIDMethod: EventListController.findByIDAndMergeWithEvents,
  	readMiddleware: JWTAuthChain,
  	createMiddleware: JWTAuthChain,
  	updateMiddleware: JWTAuthChain
});

router.put(
	"/addEvent/:eventListID/:EventID",
	JWTAuthChain,
	function(req, res) {
	EventListController.addEvent(req.app.get('db'), req.params.eventListID, req.params.EventID, function(err) {
		if (err) {
			console.warn("error adding event to list: " + err);
			res.status(500).json({ "status": constants.db_error });
		} else {
			res.status(200).json({ status: constants.success_status, id: req.params.EventID });
		}
	});
});

router.put(
	"/removeEvent/:eventListID/:EventID",
	JWTAuthChain,
	function(req, res) {
		EventListController.removeEvent(req.app.get('db'), req.params.eventListID, req.params.EventID, function(err) {
			if (err) {
				console.warn("error adding event to list: " + err);
				res.status(500).json({ "status": constants.db_error });
			} else {
				res.status(200).json({ status: constants.success_status, id: req.params.EventID });
			}
		});
	});

module.exports = router;

