import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class SummarizationService {
  async getTagsFromSummary(description: string): Promise<string> {
    const client = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] });

    const prompt = `
    Generate a set of concise, relevant tags for categorizing the following event in a database. The tags should be single words or short hyphenated phrases. Focus on the event type, musical genre, and key characteristics:

    ${description}

    Output the tags as a JSON array of strings. Do not include any additional text or formatting."""
    `;

    const stream = await client.messages.create({
      max_tokens: 1024,
      system:
        'You are a helpful assistant that generates relevant tags for events.',
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-opus-20240229',
      stream: true,
    });

    let aiResponse = '';

    for await (const messageStreamEvent of stream) {
      aiResponse += messageStreamEvent.type;
    }

    console.log('!!! aiResponse: ' + aiResponse);

    return aiResponse;
  }
}
