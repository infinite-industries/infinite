import { Module } from '@nestjs/common';
import SlackNotificationService from './slack-notification.service';

@Module({
  providers: [SlackNotificationService],
  exports: [SlackNotificationService],
})
export class NotificationsModule {}
