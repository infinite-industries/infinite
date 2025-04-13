import slackNotify from 'slack-notify';
import { logger } from './utils.js'

export default defineEventHandler(async (event) => {
  const { slackWebhookContact } = useRuntimeConfig(event);

  logger.info('JavaScript HTTP trigger function processed a request.')

  if (!slackWebhookContact) {
    logger.warn('Slack webhook is not configured; will not be able to send messages')
  }

  const body = await readBody(event);

  const name = body && body.name
  const email = body && body.email
  const comment = body && body.comment

  if (name && email && comment) {
    try {
      await PostToSlack(name, email, comment, slackWebhookContact)

      logger.info('Posted message to Slack')
      return 'Message posted.'
    } catch (e) {
      logger.error('Unable to post message to Slack: ', e)
      throw createError({
        statusCode: 500,
        statusMessage: `Unable to post to Slack. Error Message: "${e}"`
      })
    }
  } else {
    logger.error('Invalid Slack message request')
    throw createError({
      statusCode: 400,
      statusMessage: 'Please pass correct variables in the request body.'
    })
  }
})

function PostToSlack(name, email, comment, slackWebhookContact) {
  return new Promise((resolve, reject) => {
    const messageToAdmin = `${name} says: "${comment}". Please respond back at ${email}`

    // slack-notify doesn't handle this gracefully
    // hopefully it isn't necessary in production but in dev it's useful
    if (!slackWebhookContact) {
      return reject(new Error('No Slack URL configured'))
    }


    const contactChannel = slackNotify(slackWebhookContact);
    contactChannel.send({
      channel: 'contact',
      icon_emoji: ':computer:',
      text: messageToAdmin
    })
      .then(() => resolve('Message received!'))
      .catch(err => reject(new Error('API error:' + err)))
  })
}
