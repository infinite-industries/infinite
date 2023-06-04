import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  SLACK_WEBHOOK_CONTACT,
  SLACK_WEBHOOK_EVENT_SUBMISSION,
  SLACK_WEBHOOK_TEST,
  SLACK_WEBHOOK_VENUE_SUBMISSION,
} from '../constants';
import SlackNotify from 'slack-notify';
import { SlackNotifier } from 'slack-notify';
import { isNotEmptyString } from '../utils/is-not-empty-string';
import { Nullable } from '../utils/NullableOrUndefinable';
import isNotNullOrUndefined from '../utils/is-not-null-or-undefined';
const SLACK_SENDER_TEST = isNotEmptyString(SLACK_WEBHOOK_TEST)
  ? SlackNotify(SLACK_WEBHOOK_TEST)
  : null;

const SLACK_SENDER_CONTACT = isNotEmptyString(SLACK_WEBHOOK_CONTACT)
  ? SlackNotify(SLACK_WEBHOOK_CONTACT)
  : null;

const SLACK_SENDER_SUBMIT = isNotEmptyString(SLACK_WEBHOOK_EVENT_SUBMISSION)
  ? SlackNotify(SLACK_WEBHOOK_EVENT_SUBMISSION)
  : null;

const SLACK_SENDER_VENUE = isNotEmptyString(SLACK_WEBHOOK_VENUE_SUBMISSION)
  ? SlackNotify(SLACK_WEBHOOK_VENUE_SUBMISSION)
  : null;

@Injectable()
export default class SlackNotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  public async sendNotification(channelKey: ChannelKey, payload) {
    const channelName = '#' + channelKey;

    const channel = SlackNotificationService.getChannel(channelKey);

    if (isNotNullOrUndefined(channel)) {
      this.logger.debug(
        `Sending Slack notification to ${channelName}: ${payload}`,
      );
    } else {
      this.logger.warn('no slack hook set for notification');
      return;
    }

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

  private static getChannel(channelKey: ChannelKey): Nullable<SlackNotifier> {
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
