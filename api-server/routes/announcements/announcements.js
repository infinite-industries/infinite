// event related API endpoints

const AnnouncementController = require("../../controllers/announcements");
const { getDefaultRouter } = require("../helpers/routeHelpers");
const getPostBodyChecker = require('../middleware/postBodyChecker')
const JWTAuthenticator = require('../../utils/JWTAuthenticator')

const routerName = 'announcements'
const routerSingularName = 'announcement'

// requires admin access to create or update announcements
const jwtAuthenticator = JWTAuthenticator(true)
const postBodyChecker = getPostBodyChecker(routerSingularName)

const router = getDefaultRouter(routerName, routerSingularName, AnnouncementController, {}, {
  createMiddleware: [jwtAuthenticator], // anyone can create a new venue
});

// makes sure there is at least one announcement either creating and returning it or returning it
router.post("/ensure-one-announcement", [jwtAuthenticator, postBodyChecker], (req, res) => {
  console.log('processing ensure-one-announcement')

  const db = req.app.get('db')

  const where = db.literal('true = true')
  AnnouncementController.findOrCreate(db, req.postJSON, where)
    .then(resp => {
      res.status(200).json({ announcements: [resp[0]], status: 'success'})
    })
    .catch(err => {
      res.status(500).json({ error: 'could not process the request: ' + err, status: 'failure' })
    })
})

module.exports = router;
