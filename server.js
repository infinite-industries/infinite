// init project
const express = require('express');
const app = express();
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.load(); //get configuration file from .env

app.use(bodyParser.urlencoded({
    extended: true
}));

//Configure Nunjucks
var PATH_TO_TEMPLATES = 'views';
nunjucks.configure(PATH_TO_TEMPLATES, {
    autoescape: true,
    express: app
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


const routes = require('./routes/index');
const admin = require('./routes/admin');
const events = require('./routes/events');
const lists = require('./routes/lists');
const users = require('./routes/users');

app.use(express.static('public'));
app.use('/', routes);
app.use('/admin', admin);
app.use('/events', events);
app.use('/lists', lists);
app.use('/users', users);


const appPort = process.env.PORT || '7779';

app.listen(appPort, function () {
    console.log("Magic on port %d", appPort);
});
