const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const nunjucks = require('nunjucks')

dotenv.load() //get configuration file from .env

const SLACK_WEBHOOK_CONTACT = process.env.SLACK_WEBHOOK_CONTACT
const slack = require('slack-notify')(SLACK_WEBHOOK_CONTACT)

var slackNotify = function(payload){
  slack.send({
    channel: 'contact',
    icon_emoji: ':computer:',
    text: payload
  })
}

const router = express.Router()

router.use(bodyParser.json())

router.get('/404', function (req, res) {
  res.render('error-page')
})

router.get('/', function (req, res) {
  res.render('index')
})

router.post('/contact', function (req, res) {
  slackNotify('Contact Sent: '+ req.body.name +'\n'+req.body.comment+'\n email back at:'+req.body.email)
  console.log(req.body)
  res.json({'message_status':'sent'})
})

router.get('/subscribe-email', function(req, res) {
  res.send(nunjucks.render(
    '../views/subscribe-email.html'
  ))
})


module.exports = router
