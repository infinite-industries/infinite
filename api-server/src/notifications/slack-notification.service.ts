import {Inject, Injectable, LoggerService} from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import {
    SLACK_WEBHOOK_CONTACT,
    SLACK_WEBHOOK_EVENT_SUBMISSION,
    SLACK_WEBHOOK_TEST,
    SLACK_WEBHOOK_VENUE_SUBMISSION
} from "../constants";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SlackNotify = require('slack-notify')

const SLACK_SENDER_TEST: SlackChannelSender = SlackNotify(SLACK_WEBHOOK_TEST) as SlackChannelSender
const SLACK_SENDER_CONTACT: SlackChannelSender = SlackNotify(SLACK_WEBHOOK_CONTACT) as SlackChannelSender
const SLACK_SENDER_SUBMIT: SlackChannelSender = SlackNotify(SLACK_WEBHOOK_EVENT_SUBMISSION) as SlackChannelSender
const SLACK_SENDER_VENUE: SlackChannelSender = SlackNotify(SLACK_WEBHOOK_VENUE_SUBMISSION) as SlackChannelSender

@Injectable()
export default class SlackNotificationService {
    constructor (
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) {}

    public sendNotification(channelKey: ChannelKey, payload) {
        const channelName = '#' + channelKey

        const channel = this.getChannel(channelKey)

        this.logger.debug(`Sending Slack notification to ${channelName}: ${payload}`)

        channel.send({
            channel: channelName,
            icon_emoji: ':computer:',
            text: payload
        }, (err) => {
            if (err) {
                this.logger.warn(`Slack notification failed: ${err}`)
                // TODO: do we even want this service to rethrow an error?
                // does calling code need to know, or can we just log it here
                throw err
            } else {
                this.logger.debug(`Slack notification successfully sent to ${channelName}`)
            }
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
    send: (any: any, callback: (err?) => void) => any
}
