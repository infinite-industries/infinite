import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  SLACK_WEBHOOK_CONTACT,
  SLACK_WEBHOOK_EVENT_SUBMISSION,
  SLACK_WEBHOOK_TEST,
  SLACK_WEBHOOK_VENUE_SUBMISSION,
} from '../constants';

import SlackNotify, { SlackNotifier } from 'slack-notify';

const SLACK_SENDER_TEST = SlackNotify(SLACK_WEBHOOK_TEST);
const SLACK_SENDER_CONTACT = SlackNotify(SLACK_WEBHOOK_CONTACT);
const SLACK_SENDER_SUBMIT = SlackNotify(SLACK_WEBHOOK_EVENT_SUBMISSION);
const SLACK_SENDER_VENUE = SlackNotify(SLACK_WEBHOOK_VENUE_SUBMISSION);

@Injectable()
export default class SlackNotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  public async sendNotification(channelKey: ChannelKey, payload) {
    const channelName = '#' + channelKey;

    const channel = SlackNotificationService.getChannel(channelKey);

    this.logger.debug(
      `Sending Slack notification to ${channelName}: ${payload}`,
    );

    try {
      await channel.send({
        channel: channelName,
        icon_emoji: ':computer:',
        text: payload,
      });

      this.logger.debug(
        `Slack notification successfully sent to ${channelName}`,
      );
    } catch (err) {
      this.logger.warn(`Slack notification failed: ${err}`);
      // TODO: do we even want this service to rethrow an error?
      // does calling code need to know, or can we just log it here
      throw err;
    }
  }

  private static getChannel(channelKey: ChannelKey): SlackNotifier {
    switch (channelKey) {
      case TEST:
        return SLACK_SENDER_TEST;
      case CONTACT:
        return SLACK_SENDER_CONTACT;
      case EVENT_SUBMIT:
        return SLACK_SENDER_SUBMIT;
      case VENUE_SUBMIT:
        return SLACK_SENDER_VENUE;
    }
  }
}

export const TEST = 'test';
export const CONTACT = 'contact';
export const EVENT_SUBMIT = 'event-submit';
export const VENUE_SUBMIT = 'venue-submit';

export type ChannelKey =
  | typeof TEST
  | typeof CONTACT
  | typeof EVENT_SUBMIT
  | typeof VENUE_SUBMIT;
