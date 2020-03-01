// set up channel to send notifications
const SLACK_WEBHOOK_CONTACT = process.env.SLACK_WEBHOOK_CONTACT
const contactChannel = require('slack-notify')(SLACK_WEBHOOK_CONTACT)
const logger = require('./utils').logger

if (!SLACK_WEBHOOK_CONTACT) {
  logger.error('Slack webhook is not configured; will not be able to send messages')
}

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
      logger.error('Unable to post message to Slack: ', e)
    }
  } else {
    res.statusCode = 400
    res.end(
      'Please pass correct variables in the request body.'
    )
    logger.error('Invalid Slack message request')
  }
}

function PostToSlack(name, email, comment) {
  return new Promise((resolve, reject) => {
    const messageToAdmin = `${name} says: "${comment}". Please respond back at ${email}`

    // slack-notify doesn't handle this gracefully
    // hopefully it isn't necessary in production but in dev it's useful
    if (!SLACK_WEBHOOK_CONTACT) {
      return reject(new Error('No Slack URL configured'))
    }

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
