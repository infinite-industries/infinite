require('dotenv').config() // load dotenv early to provide access to env values

const JWTParser = require(__dirname + '/utils/JWTParser')
const userController = require(__dirname + '/controllers/users')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const getAPIKeyStrategy = require('./expressMiddleWare/DevTokenAuthStrategy')
const fs = require('fs')
const sequelize = require('./utils/connection')()
const secretString = fs.readFileSync(process.env.jwtPEM || './keys/1nfinite.pem')
const events = require('./routes/events')
const venues = require("./routes/venues")
const eventLists = require("./routes/eventLists")
const users = require("./routes/users")
const announcements = require('./routes/announcements')
const createICSFile = require('./routes/createICSFile')
const { logger }  = require(__dirname + '/utils/loggers')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// === Setup Constants ===
const appPort = process.env.PORT || 3003;
const schemes = [process.env.API_SCHEME || 'http']
const defaultAPIHost = 'localhost:' + appPort
const apiHost = process.env.API_HOST || defaultAPIHost

// === Setup Swagger Docs (/api-docs) ===
const swaggerDefinition = {
  info: {
    title: 'Infinite Industries API',
    version: '1.0.0',
    description: [
      'This api provides information about cultural events in and around Lexington Kentucky.',
      'It provides the backing for https://infinite.industries.'].join(' '),
  },
  host: apiHost,
  basePath: '/',
  schemes
}

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['./routes/*.js', './models/*.js']
})

// === Setup Express Routing ===
const app = express()

app.set('db', sequelize)
app.set('superSecret', secretString)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(bodyParser.json())
app.use(passport.initialize())
passport.use(getAPIKeyStrategy(sequelize))

// log all handled requests including request status and time taken
app.use((req, res, next) => {
  const url = req.url
  const startTime = Date.now()

  res.once('finish', () => {
    logger.info(`${url} ${ res.statusCode } (${Date.now() - startTime} ms)`)
  })
  next()
})

app.use(JWTParser)
app.use((req, res, next) => {
  if (req.token && req.decoded) {
    userController.ensureByName(app.get('db'), req.decoded, (err, user) => {
      if (err) {
        logger.warn('error ensuring user: ' + user)
      } else {
        // some stuff should live on token and not be persisted, mix this is from the decoded token here
        req.user = {
          ...user.toJSON(),
          ...req.decoded,
          nickname: req.decoded.nickname,
          isInfiniteAdmin: req.isInfiniteAdmin,
          venueIDs: req.venueIDs,
        }
      }

      next()
    })
  } else {
    next()
  }
})

// CORS Support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,HEAD,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'x-access-token, content-type')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

app.use("/events", events)
app.use("/venues", venues)
app.use("/event-lists", eventLists)
app.use("/users", users)
app.use('/create-ics-file', createICSFile)
app.use('/announcements', announcements)

// === Setup Sequelize Database Access ===
logger.info('Connecting to database')
sequelize
  .authenticate()
  .then(() => {
      logger.info('Connection to database established.')
      app.listen(appPort, function () {
          logger.info(`Magic on port ${appPort}`)
      });
  })
  .catch(err => {
      logger.error('Unable to connect to the database:', err)
      process.exit(1)
  })
