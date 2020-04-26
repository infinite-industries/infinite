/**
 * @swagger
 *
 * definitions:
 *  AnnouncementResponse:
 *    type: object
 *    properties:
 *      status:
 *        type: string
 *        enum: ["success", "failure"]
 *      error_message:
 *        type: string
 *      announcements:
 *        type: array
 *        items:
 *          $ref: '#definitions/Announcement'
 */

/**
 * @swagger
 *
 * definitions:
 *  NewAnnouncementRequest:
 *    type: object
 *    required:
 *      - announcement
 *    properties:
 *      announcement:
 *        type: object
 *        required:
 *          - message
 *        properties:
 *          message:
 *            type: string
 */

/**
 * @swagger
 *
 * /announcements:
 *  get:
 *    description: gets the list of announcements
 *    produces: application/json
 *    responses:
 *      200:
 *        description: Success!
 *        schema:
 *          $ref: '#definitions/AnnouncementResponse'
 *      501:
 *        description: There was an error processing the request.
 *        schema:
 *          $ref: '#definitions/AnnouncementResponse'
 *      422:
 *        description: A parameter supplied was not allowed or understood.
 *        schema:
 *          $ref: '#definitions/AnnouncementResponse'
 */

/**
 * @swagger
 *
 * /announcements:
 *  post:
 *    description: creates a new announcement (requires admin access)
 *    produces: application/json
 *    security:
 *      - jwt:
 *    parameters:
 *      - in: body
 *        name: announcement
 *        description: the announcement to create
 *        schema:
 *          $ref: '#/definitions/NewAnnouncementRequest'
 *    responses:
 *      200:
 *        description: Success!
 *        schema:
 *          $ref: '#definitions/AnnouncementResponse'
 *      501:
 *        description: There was an error processing the request.
 *        schema:
 *          $ref: '#definitions/AnnouncementResponse'
 *      422:
 *        description: A parameter supplied was not allowed or understood.
 *        schema:
 *          $ref: '#definitions/AnnouncementResponse'
 */

/**
 * @swagger
 *
 * /announcements/{id}:
 *  put:
 *    description: updates an announcement (requires admin access)
 *    produces: application/json
 *    security:
 *      - jwt:
 *    parameters:
 *      - name: id
 *        description: the announcement to update
 *        in: path
 *        required: true
 *        type: string
 *      - in: body
 *        name: announcement
 *        description: the announcement to create
 *        schema:
 *          $ref: '#/definitions/NewAnnouncementRequest'
 *    responses:
 *      200:
 *        description: Success!
 *        schema:
 *          $ref: '#definitions/AnnouncementResponse'
 *      501:
 *        description: There was an error processing the request.
 *        schema:
 *          $ref: '#definitions/AnnouncementResponse'
 *      422:
 *        description: A parameter supplied was not allowed or understood.
 *        schema:
 *          $ref: '#definitions/AnnouncementResponse'
 */

// event related API endpoints
const AnnouncementController = require("../controllers/announcements");
const { getDefaultRouter } = require("./helpers/routeHelpers");

const JWTAuthenticator = require(__dirname + '/../utils/JWTAuthenticator')

// requires admin access to create or update announcements
const jwtAuthenticator = JWTAuthenticator(true)

const router = getDefaultRouter("announcements", "announcement", AnnouncementController, {}, {
  createMiddleware: [jwtAuthenticator], // anyone can create a new venue
});

module.exports = router;