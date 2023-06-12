import { Inject, Injectable, LoggerService } from '@nestjs/common';
import axios from 'axios';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import isNotNullOrUndefined from '../utils/is-not-null-or-undefined';
import { BITLY_TOKEN, BITLY_URI } from '../constants';

@Injectable()
export default class BitlyService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async createLink(infiniteUrl: string): Promise<string | null> {
    const headers = this.buildHeader();

    this.logger.debug(`Sending ${infiniteUrl} to Link shortener`);

    try {
      const response = await axios.post(
        BITLY_URI,
        { long_url: infiniteUrl },
        { headers },
      );

      return response.data && response.data.link ? response.data.link : null;
    } catch (ex) {
      const errors =
        ex.response && ex.response.data
          ? ex.response.data.length
            ? ex.response.data.map((e) => e.message).join(', ')
            : ex.response.data.message
          : 'n/a';

      this.logger.error(
        `Link shortener failed (${
          ex.response && ex.response.status
        }: ${errors}) -- ${ex}`,
      );

      throw new Error('Link shortener failed');
    }
  }

  isBitlyTokenSet(): boolean {
    return (
      isNotNullOrUndefined(BITLY_TOKEN) &&
      typeof BITLY_TOKEN === 'string' &&
      BITLY_TOKEN.trim() !== ''
    );
  }

  private buildHeader(): { Authorization: string; 'Content-Type': string } {
    return {
      Authorization: `Bearer ${BITLY_TOKEN}`,
      'Content-Type': 'application/json',
    };
  }
}
