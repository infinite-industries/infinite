// set up channel to send notifications
const SLACK_WEBHOOK_ANALYTICS = process.env.SLACK_WEBHOOK_ANALYTICS
const contactChannel = require('slack-notify')(SLACK_WEBHOOK_ANALYTICS)
const logger = require('./utils').logger

if (!SLACK_WEBHOOK_ANALYTICS) {
  logger.warn('Slack webhook (analytics) is not configured; will not be able to send messages')
}

export const ENV = process.env.ENV || 'dev'

export default async function slackAnalyticsHandler(req, res) {
  logger.info('JavaScript HTTP trigger (analytics) function processed a request.')

  if (req.method === 'POST' && req.url.match(/\/?tag-feedback/i)) {
    logger.info('Processing tag generation feedback')
    if (req.body.suggested && req.body.submitted) {
      try {
        await PostToSlack(req.body.suggested, req.body.submitted, req.body.eventId)
      } catch (e) {
        logger.error(e)
        res.statusCode = 500
        return res.end()
      }
    } else {
      res.statusCode = 400
      return res.end()
    }
  }

  // more may be added here in the future

  res.statusCode = 200
  res.end()
}

function PostToSlack(suggested, submitted, eventId) {
  return new Promise((resolve, reject) => {
    const message = JSON.stringify({
      type: 'tag-feedback',
      env: ENV,
      suggested,
      submitted,
      ...(eventId ? { eventId } : null)
    })

    // slack-notify doesn't handle this gracefully
    // hopefully it isn't necessary in production but in dev it's useful
    if (!SLACK_WEBHOOK_ANALYTICS) {
      return reject(new Error('No Slack URL configured'))
    }

    contactChannel.send({
      channel: 'analytics',
      icon_emoji: ':computer:',
      text: message
    })
      .then(() => resolve('Message received!'))
      .catch(err => reject(new Error('API error:' + err)))
  })
}
