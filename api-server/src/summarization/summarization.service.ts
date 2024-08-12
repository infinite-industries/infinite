import { HttpException, Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class SummarizationService {
  private readonly client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] });
  }
  async getTagsFromSummary(description: string): Promise<string[]> {
    const prompt = `
    Generate a set of concise, relevant tags for categorizing the following event in a database. The tags should be single words or short hyphenated phrases. Focus on the event type, musical genre, and key characteristics:

    ${description}

    Output the tags as a JSON array of strings. Do not include any additional text or formatting."""
    `;

    const numTries = 3;
    for (let i = 0; i < numTries; i++) {
      try {
        if (numTries > 0) {
          console.info('trying to get a valid message from anthropic again');
        }

        return this.tryToGetSummaryTags(prompt);
      } catch (ex) {
        console.warn(`error handled for attempt ${i + 1}`);
      }
    }

    console.warn(
      `unable to get a valid set of tags from anthropic after ${numTries} attempts`,
    );

    throw new HttpException(
      'Unable to get a valid response from third party tag provider',
      500,
    );
  }

  private async tryToGetSummaryTags(prompt: string): Promise<string[]> {
    const message: Anthropic.Message = await this.client.messages.create({
      max_tokens: 300,
      system:
        'You are a helpful assistant that generates relevant tags for events.',
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-sonnet-20240229',
      temperature: 0.5,
    });

    const messageText = this.getAnthropicMessageText(message);
    return this.parseMessageTextToArray(messageText);
  }

  private getAnthropicMessageText(message: Anthropic.Message) {
    return message?.content
      .map((contentBlock) =>
        contentBlock.type === 'text' ? contentBlock.text : null,
      )
      .reduce((acc, val) => (val === null ? '' : val), '');
  }

  private parseMessageTextToArray(messageText: string): string[] {
    const parsedValue: unknown = this.parseMessageText(messageText);

    if (Array.isArray(parsedValue)) {
      if (parsedValue.length === 0) {
        // for now it may be worth not retrying this edge case, lets just log and move on
        console.warn(
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
        console.warn(
          'The tag array returned by anthropic is a json array but does not contain all string values',
        );

        throw new BadAnthropicResponse();
      }
    } else {
      console.warn('Anthropic returned valid JSON but it was not an array');
      throw new BadAnthropicResponse();
    }
  }

  private parseMessageText(messageText: string): unknown {
    try {
      return JSON.parse(messageText);
    } catch (ex) {
      console.warn('invalid json returned from anthropic');
      throw new BadAnthropicResponse();
    }
  }
}

class BadAnthropicResponse extends Error {
  constructor() {
    super('Anthropic Returned A Bad Response');
  }
}
