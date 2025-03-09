import slackNotify from 'slack-notify';
import { logger } from './utils.js'

export const ENV = process.env.ENV || 'dev'

export default defineEventHandler(async (event) => {
  const { slackWebhookAnalytics } = useRuntimeConfig(event);
  logger.info('JavaScript HTTP trigger (analytics) function processed a request.')

  if (!slackWebhookAnalytics) {
    logger.warn('Slack webhook (analytics) is not configured; will not be able to send messages')
  }

  // deprecated now that we're also tracking brief description/"summary";
  // prefer "suggestion-feedback"
  if (isMethod(event, 'POST') && event.path.match(/\/?tag-feedback/i)) {
    logger.info('Processing tag generation feedback')
    const body = await readBody(event);

    if (body.suggested && body.submitted) {
      try {
        await PostToSlack('tag-feedback', body.suggested, body.submitted, body.eventId, slackWebhookAnalytics)
      } catch (e) {
        logger.error(e)

        throw createError({
          statusCode: 500,
          statusMessage: 'could post tag-feedback analytics to slack channel'
        })
      }
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'invalid request for tag-feedback analytics'
      })
    }
  } else if (isMethod(event, 'POST') && event.path.match(/\/?suggestion-feedback/i)) {
    logger.info('Processing submission suggestion feedback')
    const body = await readBody(event);

    if (body.suggested && body.submitted) {
      try {
        await PostToSlack('suggestion-feedback', body.suggested, body.submitted, body.eventId, slackWebhookAnalytics)
      } catch (e) {
        logger.error(e)
        throw createError({
          statusCode: 500,
          statusMessage: 'could post suggestion-feedback analytics to slack channel'
        })
      }
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'invalid request for suggestion-feedback analytics'
      })
    }
  }

  // more may be added here in the future
  return "";
})

function PostToSlack(type, suggested, submitted, eventId, slackWebhookAnalytics) {
  return new Promise((resolve, reject) => {

    const message = JSON.stringify({
      type,
      env: ENV,
      suggested,
      submitted,
      ...(eventId ? { eventId } : null)
    })

    // slack-notify doesn't handle this gracefully
    // hopefully it isn't necessary in production but in dev it's useful
    if (slackWebhookAnalytics) {
      const contactChannel = slackNotify(slackWebhookAnalytics)
      contactChannel.send({
        channel: 'analytics',
        icon_emoji: ':computer:',
        text: message
      })
        .then(() => resolve('Message received!'))
        .catch(err => reject(new Error('API error:' + err)))
    } else {
      console.warn('slack webhooks are not enabled -- no analytics sent')
      resolve()
    }
  })
}
