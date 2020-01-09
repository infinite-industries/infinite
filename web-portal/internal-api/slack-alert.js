// set up channel to send notifications
const SLACK_WEBHOOK_CONTACT = process.env.SLACK_WEBHOOK_CONTACT
const contactChannel = require('slack-notify')(SLACK_WEBHOOK_CONTACT)
const logger = require('./utils').logger

export default async function slackAlertHandler(req, res) {
  logger.info('JavaScript HTTP trigger function processed a request.')

  const name = req.body && req.body.name
  const email = req.body && req.body.email
  const comment = req.body && req.body.comment

  if (name && email && comment) {
    try {
      await PostToSlack(name, email, comment)

      res.statusCode = 200
      res.end('Message posted.')
      logger.info('Posted message to Slack')
    } catch (e) {
      res.statusCode = 500
      res.end(`Unable to post to Slack. Error Message: "${e}"`)
      logger.error('Unable to post message to Slack', e)
    }
  } else {
    res.statusCode = 400
    res.end(
      'Please pass correct variables in the request body.'
    )
    logger.error('Invalid Slack message request')
  }
}

function PostToSlack(name, comment, email) {
  return new Promise((resolve, reject) => {
    const messageToAdmin = `${name} says: "${comment}". Please respond back at ${email}`

    contactChannel.send({
      channel: 'contact',
      icon_emoji: ':computer:',
      text: messageToAdmin
    }, function (err) {
      if (err) {
        reject(new Error('API error:' + err))
      } else {
        resolve('Message received!')
      }
    })
  })
}
