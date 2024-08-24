import { HttpException, Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { delay } from 'rxjs';
const fs = require('fs');
const { parse } = require('csv-parse');
const ObjectsToCsv = require('objects-to-csv');

@Injectable()
export class SummarizationService {
  private readonly client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] });
  }
  async getTagsFromSummary(description: string): Promise<string[]> {
    const rows = await this.getFile();
    console.log('!!! rows: ', rows);

    const completedRows = await Promise.all(
      rows.map(async (row) => {
        const description = row[0];
        const tags = row[1];

        try {
          const suggestedTags = await this._getTagsFromSummary(description);
          delay(1000);
          // console.log('!!! got suggestedTags: ', suggestedTags);

          return [description, tags, suggestedTags];
        } catch (ex) {
          console.warn('!!! could not get do it: ', ex);
          return [description, tags, 'ERROR: ' + ex];
        }
      }),
    );

    const csv = new ObjectsToCsv(completedRows);
    await csv.toDisk(
      '/Users/chriswininger/projects/infinite/api-server/src/summarization/caw_description_tags_output_6.csv',
    );

    return this._getTagsFromSummary(description);
  }

  async _getTagsFromSummary(description: string): Promise<string[]> {
    const sanitizedDescription = this.sanitizeDescription(description);

    const prompt = `
    Generate a set of concise, relevant tags for categorizing the following event in a database.
    The tags should be single words or short hyphenated phrases. Focus on the event type, musical genre,
    and key characteristics. When applicable, use one of these tags "gallery, music, theater, dance, film, literary-arts,
    talk, festival, comedy":

    ${sanitizedDescription}

    Output the tags as a JSON array of strings. Do not include any additional text or formatting. Make it directly
    consumable by a function such as
    
    function myFunction(tags: string []) {
      tags.forEach(tag => console.log("tag is:" + tag);
    }
    `;

    const errors = [];
    const numTries = 3;
    for (let i = 0; i < numTries; i++) {
      try {
        if (numTries > 0) {
          console.info('trying to get a valid message from anthropic again');
        }

        return await this.tryToGetSummaryTags(prompt);
      } catch (ex) {
        errors.push(ex);
        console.warn(`error handled for attempt ${i + 1}: ` + ex);
      }
    }

    console.warn(
      `unable to get a valid set of tags from anthropic after ${numTries} attempts`,
    );

    throw new HttpException(
      'Unable to get a valid response from third party tag provider: ' +
        JSON.stringify(errors, null, 4),
      500,
    );
  }

  private async getFile(): Promise<[]> {
    const rows: [] = [];

    return new Promise((resolve, _) => {
      fs.createReadStream(
        '/Users/chriswininger/projects/infinite/api-server/src/summarization/caw_description_tags.csv',
      )
        .pipe(parse({ delimiter: ',', from_line: 2 }))
        .on('data', async function (row) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          rows.push(row);
        })
        .on('end', function () {
          resolve(rows);
        });
    });
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
          'The tag array returned by anthropic is a json array but does not contain all string values: ',
          parsedValue,
        );

        throw new BadAnthropicResponse(
          'The tag array returned by anthropic is a json array but does not contain all string values: ' +
            messageText,
        );
      }
    } else {
      console.warn('Anthropic returned valid JSON but it was not an array');
      throw new BadAnthropicResponse(
        'Anthropic returned valid JSON but it was not an array: ' + messageText,
      );
    }
  }

  private parseMessageText(messageText: string): unknown {
    try {
      return JSON.parse(messageText);
    } catch (ex) {
      console.warn(`invalid json returned from anthropic: "${messageText}"`);
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
  constructor(messasge = 'Anthropic Returned A Bad Response') {
    super(messasge);
  }
}
