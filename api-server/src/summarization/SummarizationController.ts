import { Body, Controller, Post } from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { SummarizationService } from './summarization.service';
import { PredictTagsFromDescriptionRequest } from './dto/PredictTagsFromDescriptionRequest';
import { IsNotEmpty } from 'class-validator';

@Controller(`${VERSION_1_URI}/summarization`)
@ApiTags('uploads')
export class SummarizationController {
  constructor(private readonly summarizationService: SummarizationService) {}

  @Post('get-tags')
  @ApiOperation({
    summary:
      'returns a list of suggested tags based on the provided description',
  })
  async getTagsForSummary(
    @Body() newEvent: PredictTagsFromDescriptionRequest,
  ): Promise<string[]> {
    return await this.summarizationService.getTagsFromSummary(
      newEvent.description,
    );
  }

  @Post('get-brief-description')
  @ApiOperation({
    summary: 'returns a brief description based on the provided full description',
  })
  async getABriefDescription(
    @Body() newEvent: PredictTagsFromDescriptionRequest,
  ): Promise<SummarizationBriefDescriptionResponse> {
    const summary =
      await this.summarizationService.getBriefDescriptionFromSummary(
        newEvent.description,
      );

    return new SummarizationBriefDescriptionResponse(summary);
  }
}

class SummarizationBriefDescriptionResponse {
  @ApiProperty({ example: 'A theatrical performance the Bards of Kentucky' })
  @IsNotEmpty()
  summary: string;

  constructor(summary: string) {
    this.summary = summary;
  }
}
