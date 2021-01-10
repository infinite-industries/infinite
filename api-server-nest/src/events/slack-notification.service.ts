import {Injectable} from "@nestjs/common";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SlackNotify = require('slack-notify')

console.log('!!! SlackNotify: ' + SlackNotify)

require('dotenv').config()

const SLACK_WEBHOOK_TEST = process.env.SLACK_WEBHOOK_TEST
const SLACK_WEBHOOK_CONTACT = process.env.SLACK_WEBHOOK_CONTACT
const SLACK_WEBHOOK_EVENT_SUBMISSION = process.env.SLACK_WEBHOOK_EVENT_SUBMISSION
const SLACK_WEBHOOK_VENUE_SUBMISSION = process.env.SLACK_WEBHOOK_VENUE_SUBMISSION

const SLACK_SENDER_TEST: SlackChannelSender = SlackNotify(SLACK_WEBHOOK_TEST) as SlackChannelSender
const SLACK_SENDER_CONTACT: SlackChannelSender = SlackNotify(SLACK_WEBHOOK_CONTACT) as SlackChannelSender
const SLACK_SENDER_SUBMIT: SlackChannelSender = SlackNotify(SLACK_WEBHOOK_EVENT_SUBMISSION) as SlackChannelSender
const SLACK_SENDER_VENUE: SlackChannelSender = SlackNotify(SLACK_WEBHOOK_VENUE_SUBMISSION) as SlackChannelSender

@Injectable()
export default class SlackNotificationService {
    public sendNotification(channelKey: ChannelKey, payload) {
        const channelName = '#' + channelKey

        console.log('!!! channelKey: ' + channelKey + ' - ' + SLACK_WEBHOOK_EVENT_SUBMISSION)

        const channel = this.getChannel(channelKey)

        channel.send({
            channel: channelName,
            icon_emoji: ':computer:',
            text: payload
        })
    }

    private getChannel(channelKey: ChannelKey): SlackChannelSender {
        switch (channelKey) {
            case TEST:
                return SLACK_SENDER_TEST
            case CONTACT:
                return SLACK_SENDER_CONTACT
            case EVENT_SUBMIT:
                return SLACK_SENDER_SUBMIT
            case VENUE_SUBMIT:
                return SLACK_SENDER_VENUE
        }
    }
}

export const TEST = 'test'
export const CONTACT = 'contact'
export const EVENT_SUBMIT = 'event-submit'
export const VENUE_SUBMIT = 'venue-submit'

export type ChannelKey = typeof TEST | typeof CONTACT | typeof EVENT_SUBMIT | typeof VENUE_SUBMIT

export type SlackChannelGrouper = {
    test: unknown,
    contact: unknown,
    'event-sumbit': unknown,
}

export type SlackChannelSender = {
    send: (any) => any
}
