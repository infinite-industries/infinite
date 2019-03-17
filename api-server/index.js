// working on seeding the database

const JWTParser = require(__dirname + '/utils/JWTParser')
const userController = require(__dirname + '/controllers/users')
var express = require('express');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
const passport = require('passport');
const getAPIKeyStrategy = require('./expressMiddleWare/DevTokenAuthStrategy');
const fs = require('fs')
const sequelize = require('./utils/connection')()
const secretString = fs.readFileSync(process.env.jwtPEM || './keys/1nfinite.pem');
const events = require('./routes/events');
const venues = require("./routes/venues");
const eventLists = require("./routes/eventLists");
const users = require("./routes/users");

var app = express();

app.set('db', sequelize)
app.set('superSecret', secretString);

app.use(bodyParser.json());
app.use(passport.initialize());
passport.use(getAPIKeyStrategy(sequelize));

app.use(JWTParser)
app.use((req, res, next) => {
  if (req.token && req.decoded) {
    userController.ensureByName(app.get('db'), req.decoded, (err, user) => {
      if (err) {
        console.warn('error ensuring user: ' + user)
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
app.use("/events", events);
app.use("/venues", venues);
app.use("/event-lists", eventLists);
app.use("/users", users);

var appPort = process.env.PORT || '3003';

sequelize
  .authenticate()
  .then(() => {
      console.info('Connection to database established.')
      app.listen(appPort, function () {
          console.log("Magic on port %d", appPort)
      });
  })
  .catch(err => {
      console.error('Unable to connect to the database:', err)
      process.exit(1)
  })
