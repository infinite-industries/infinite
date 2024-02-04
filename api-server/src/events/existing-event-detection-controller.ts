import {
  Body,
  Controller,
  HttpCode,
  Inject,
  LoggerService,
  Post,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import ExistingEventDetectionService from './existing-event-detection-service';
import { VERSION_1_URI } from '../utils/versionts';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import ExistingEventDetectionParameters from './dto/existing-event-detection-parameters';
import ExistingEventDetectionResults from './dto/existing-event-detection-results';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Controller(`${VERSION_1_URI}/events/detect-existing`)
@ApiTags('events')
export class ExistingEventDetectionController {
  constructor(
    private readonly duplicateDetectionService: ExistingEventDetectionService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post('/by-time-and-location')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Determine if someone may have already submitted an event before based on the start times and the venue',
  })
  async detectExistingEvents(
    @Body() eventSearchParameters: ExistingEventDetectionParameters,
  ): Promise<ExistingEventDetectionResults> {
    return this.duplicateDetectionService.detectExistingEventsByTimeAndLocation(
      eventSearchParameters,
    );
  }
}
