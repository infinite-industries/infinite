// User (devs curators) management here
const UsersController = require("../controllers/users");
const JWTAuthenticator = require(__dirname + '/../utils/JWTAuthenticator')

const authChain = [JWTAuthenticator(false)] // require token

const constants = {
	db_error: "db_fail",
	success_status: "success"
};
const { getDefaultRouter } = require("./helpers/routeHelpers");
const router = getDefaultRouter("users", "user", UsersController, {}, {
	// provides special controller methods for getters to merge data from multiple tables
	allMethod: UsersController.allAndMergeWithEventLists,
	byIDMethod: UsersController.findByIDAndMergeWithEventLists,

	// secure the read as well as the write routes for users
	readMiddleware: authChain
});

router.get("/current", authChain, (req, res) => {
  res.status(200).json({ user: req.user })
})

// add a new list for this user
router.put(
	"/addList/:userID/:listID", // TODO (CAW) user id should come from the token not the url
	authChain,
	function(req, res) {
		console.log("Adding a list - %s for user- %s",req.params.listID, req.params.userID);


		UsersController.addList(req.app.get('db'), req.params.userID, req.params.listID, function(err) {
			if (err) {
				console.warn("error adding event to list: " + err);
				res.status(500).json({ "status": constants.db_error });
			} else {
				res.status(200).json({ status: constants.success_status });
			}
		});
	});

module.exports = router;
