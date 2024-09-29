import {
  HttpException,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { isNullOrUndefined } from '../utils';
import { isEmptyString } from '../utils/is-not-empty-string';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class SummarizationService {
  private readonly client: Anthropic;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger = logger;

    if (isEmptyString(process.env['ANTHROPIC_API_KEY'])) {
      this.logger.warn(
        'ANTHROPIC_API_KEY is not set, the server will not be able to recommended tags',
      );
    } else {
      this.client = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] });
    }
  }
  async getTagsFromSummary(description: string): Promise<string[]> {
    if (isNullOrUndefined(this.client)) {
      return [];
    }

    const sanitizedDescription = this.sanitizeDescription(description);

    const prompt = `
    Generate a set of concise, relevant tags for categorizing the following event in a database.
    The tags should be single words or short hyphenated phrases. Focus on the event type, musical genre,
    and key characteristics. When applicable, use one of these tags
    'gallery, music, theater, dance, film, literary-arts, talk, festival, comedy'
    
    This is important, generate a valid array JSON strings.
    
    Example1 : [ "gallery", "music" ]
    
    Output JSON only.
    Do not wrap JSON output in anything.
    Do not try to explain the code you generated.
    Do not add any other text to your JSON output.
    
    ${sanitizedDescription}

    Output the tags as a JSON array of strings. Do not include any additional text or formatting."""
    `;

    const errors = [];
    const numTries = 3;
    for (let i = 0; i < numTries; i++) {
      try {
        if (numTries > 0) {
          this.logger.log('trying to get a valid message from anthropic again');
        }

        return this.tryToGetSummaryTags(prompt);
      } catch (ex) {
        errors.push(ex);
        this.logger.warn(`error handled for attempt ${i + 1}: ` + ex);
      }
    }

    this.logger.warn(
      `unable to get a valid set of tags from anthropic after ${numTries} attempts
      
      ${JSON.stringify(errors, null, 4)}
      `,
    );

    throw new HttpException(
      'Unable to get a valid response from third party tag provider',
      503,
    );
  }

  private async tryToGetSummaryTags(prompt: string): Promise<string[]> {
    const messageText = await this.promptAnthropic(prompt);

    const tags = this.parseMessageTextToArray(messageText);

    if (tags.length > 3) {
      return tags.slice(0, 3);
    }

    return tags;
  }

  private async promptAnthropic(prompt: string) {
    const message: Anthropic.Message = await this.client.messages.create({
      max_tokens: 300,
      system:
        'You are a helpful assistant that generates relevant tags for events.',
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-sonnet-20240229',
      temperature: 0.5,
    });

    return this.getAnthropicMessageText(message);
  }

  private getAnthropicMessageText(message: Anthropic.Message) {
    return message?.content
      .map((contentBlock) =>
        contentBlock.type === 'text' ? contentBlock.text : null,
      )
      .reduce((acc, val) => (val === null ? '' : val), '');
  }

  private parseMessageTextToArray(messageText: string): string[] {
    // this can make some outputs useful, go ahead and try
    if (messageText.indexOf('```json') === 0) {
      messageText = messageText.replace('```json', '').replace('```', '');
    }

    const parsedValue: unknown = this.parseMessageText(messageText);

    if (Array.isArray(parsedValue)) {
      if (parsedValue.length === 0) {
        // for now, it may be worth not retrying this edge case, lets just log and move on
        this.logger.warn(
          'Anthropic returned a valid but empty array of strings, no suggested tags',
        );
        return [];
      }

      const isStringArray = parsedValue.map(
        (value) => typeof value === 'string',
      );

      if (isStringArray) {
        return parsedValue;
      } else {
        this.logger.warn(
          'The tag array returned by anthropic is a json array but does not contain all string values: ',
          parsedValue,
        );

        throw new BadAnthropicResponse(
          'The tag array returned by anthropic is a json array but does not contain all string values: ' +
            messageText,
        );
      }
    } else {
      this.logger.warn('Anthropic returned valid JSON but it was not an array');
      throw new BadAnthropicResponse(
        'Anthropic returned valid JSON but it was not an array: ' + messageText,
      );
    }
  }

  private parseMessageText(messageText: string): unknown {
    try {
      return JSON.parse(messageText);
    } catch (ex) {
      this.logger.warn(
        `invalid json returned from anthropic: "${messageText}"`,
      );
      throw new BadAnthropicResponse(
        `invalid json returned from anthropic: "${messageText}"`,
      );
    }
  }

  private sanitizeDescription(description: string): string {
    const maxLen = 10000;

    return description
      .replace(/<[^<]+?>/gi, '') // replace html tags
      .replace(/[^\x20-\x7E]/g, '') // replace non-printable characters
      .slice(0, maxLen) // limit length
      .trim(); // drop any trailing white space;
  }
}

class BadAnthropicResponse extends Error {
  constructor(message = 'Anthropic Returned A Bad Response') {
    super(message);
  }
}
