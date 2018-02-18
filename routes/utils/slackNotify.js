//get configuration file from .env
const dotenv = require('dotenv')
dotenv.load()

// set channels to send notofications to
const slackChannels = {}

const SLACK_WEBHOOK_TEST = process.env.SLACK_WEBHOOK_TEST
slackChannels['test'] = require('slack-notify')(SLACK_WEBHOOK_TEST)

const SLACK_WEBHOOK_CONTACT = process.env.SLACK_WEBHOOK_CONTACT
slackChannels['contact'] = require('slack-notify')(SLACK_WEBHOOK_CONTACT)

const SLACK_WEBHOOK_EVENT_SUBMISSION = process.env.SLACK_WEBHOOK_EVENT_SUBMISSION
slackChannels['submission'] = require('slack-notify')(SLACK_WEBHOOK_EVENT_SUBMISSION)

module.exports = {
  Notify: function(channel_name,payload){
    const _channel = '#'+channel_name

    slackChannels[channel_name].send({
     channel: _channel,
     icon_emoji: ':computer:',
     text: payload
    })
  },
  Test: function(){
    console.log("Testing All Slack Channels", slackChannels);

    Object.keys(slackChannels).forEach(function(channel_name) {
      console.log("---------\n channel: ", channel_name)
      const _channel = "#"+channel_name

      slackChannels[channel_name].send({
       channel: _channel,
       icon_emoji: ':computer:',
       text: "TESTING"
      })

    })
  }

}
