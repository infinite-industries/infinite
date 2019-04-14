// init project
const express = require('express')
const path = require('path')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.load() //get configuration file from .env

const secretString = fs.readFileSync(process.env.SECRET_STRING_FILE)
const JWTParser = require(__dirname + '/routes/utils/JWTParser')


const app = express()
app.set('superSecret', secretString)

app.use(bodyParser.urlencoded({
  extended: true
}))

//Configure Nunjucks
var PATH_TO_TEMPLATES = 'views'
nunjucks.configure(PATH_TO_TEMPLATES, {
  autoescape: true,
  express: app
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')


const routes = require('./routes/index')

const events = require('./routes/events')
const calendar = require('./routes/calendar')
const venues = require('./routes/venues')


app.use(express.static('public'))
app.use('/', [JWTParser, routes])
app.use('/events', [JWTParser, events])
app.use('/calendar', [JWTParser, calendar])
app.use('/venues', [JWTParser, venues])
app.use((req, res) => {
  // catch all, returns index so that we can let the spa decide what to do
  res.render('index')
})

const appPort = process.env.PORT || '7779'

app.listen(appPort, function () {
  console.log('Magic on port %d', appPort)
})
