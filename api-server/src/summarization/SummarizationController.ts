import { Body, Controller, Post } from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SummarizationService } from './summarization.service';
import { PredictTagsFromDescriptionRequest } from './dto/PredictTagsFromDescriptionRequest';

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
}
