// set channels to send notofications to
const SlackNotify = require('slack-notify')
const slackChannels = {}
const { logger } = require(__dirname + '/loggers')

const SLACK_WEBHOOK_TEST = process.env.SLACK_WEBHOOK_TEST
slackChannels['test'] = SlackNotify(SLACK_WEBHOOK_TEST)

const SLACK_WEBHOOK_CONTACT = process.env.SLACK_WEBHOOK_CONTACT
slackChannels['contact'] = SlackNotify(SLACK_WEBHOOK_CONTACT)

const SLACK_WEBHOOK_EVENT_SUBMISSION = process.env.SLACK_WEBHOOK_EVENT_SUBMISSION
slackChannels['event-submit'] = SlackNotify(SLACK_WEBHOOK_EVENT_SUBMISSION)

const SLACK_WEBHOOK_VENUE_SUBMISSION = process.env.SLACK_WEBHOOK_VENUE_SUBMISSION
slackChannels['venue-submit'] = SlackNotify(SLACK_WEBHOOK_VENUE_SUBMISSION)

module.exports = {
  Notify: function(channel_name,payload){
    const _channel = '#' + channel_name

    if (!slackChannels[channel_name]) {
      throw new Error(`The slack channel "${channel_name}" is not defined`)
    }

    slackChannels[channel_name].send({
      channel: _channel,
      icon_emoji: ':computer:',
      text: payload
    })
  },
  Test: function(){
    console.log('Testing All Slack Channels', slackChannels)

    Object.keys(slackChannels).forEach(function(channel_name) {
      logger.info('---------\n channel: ', channel_name)
      const _channel = '#'+channel_name

      slackChannels[channel_name].send({
        channel: _channel,
        icon_emoji: ':computer:',
        text: 'TESTING'
      })

    })
  }

}
