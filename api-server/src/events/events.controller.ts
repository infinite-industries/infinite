import moment from 'moment';
import { Op, literal } from 'sequelize';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { EventModel } from './models/event.model';
import { Inject, LoggerService } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VERSION_1_URI } from '../utils/versionts';
import { getOptionsForEventsServiceFromEmbedsQueryParam } from '../utils/get-options-for-events-service-from-embeds-query-param';
import getCommonQueryTermsForEvents from '../utils/get-common-query-terms-for-events';
import { mapDateTimesToIso } from '../utils/map-date-times-to-iso';
import { CreateEventRequest } from './dto/create-event-request';
import SlackNotificationService, {
  EVENT_SUBMIT,
} from '../notifications/slack-notification.service';
import { EventsResponse } from './dto/events-response';
import { SingleEventResponse } from './dto/single-event-response';
import { Request } from 'express';
import { removeSensitiveDataForNonAdmins } from '../authentication/filters/remove-sensitive-data-for-non-admins';
import FindByIdParams from '../dto/find-by-id-params';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { eventModelToEventDTO } from './dto/eventModelToEventDTO';
import EventDTO from './dto/eventDTO';
import { ENV } from '../constants';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import {
  EVENT_PAGINATION_DEFAULT_PAGE,
  EVENT_PAGINATION_DEFAULT_PAGE_SIZE,
  PaginationDto,
} from './dto/pagination-dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Controller(`${VERSION_1_URI}/events`)
@ApiTags('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly slackNotificationService: SlackNotificationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Get('current-verified')
  @ApiOperation({
    summary:
      'Get current events that have been verified (for public consumptions)',
  })
  @ApiResponse({
    status: 200,
    description: 'current verified events',
    type: EventsResponse,
  })
  getAllCurrentVerified(
    @Query('embed') embed: string[] | string = [],
    @Query('tags') tags: string[] | string = [],
    @Query('category') category: string | '',
    @Req() request: Request,
  ): Promise<EventsResponse> {
    if (typeof embed === 'string') {
      embed = [embed, 'DATE_TIME'];
    } else {
      embed.push('DATE_TIME');
    }

    const findOptions = {
      ...getOptionsForEventsServiceFromEmbedsQueryParam(embed),
      where: {
        [Op.and]: [
          getCommonQueryTermsForEvents(true, tags, category),
          {
            '$date_times.end_time$': {
              [Op.gte]: moment().subtract(2, 'hours').toDate(),
            },
          },
        ],
      },
      order: [literal('date_times.start_time ASC')],
    };

    return this.eventsService
      .findAll(findOptions)
      .then((events) => events.map(eventModelToEventDTO))
      .then((events) => removeSensitiveDataForNonAdmins(request, events))
      .then((events) => new EventsResponse({ events }));
  }

  @Get('verified')
  @ApiOperation({
    summary: 'Get all events that have been verified (for public consumptions)',
  })
  @ApiResponse({
    status: 200,
    description: 'verified events',
    type: EventsResponse,
  })
  @ApiImplicitQuery({
    name: 'tags',
    description: 'filter by associated tags',
    example: ['music'],
    required: false,
    isArray: true,
    type: String,
  })
  @ApiImplicitQuery({
    name: 'page',
    description: `the requested page (default ${EVENT_PAGINATION_DEFAULT_PAGE})`,
    example: 1,
    required: false,
    type: Number,
  })
  @ApiImplicitQuery({
    name: 'pageSize',
    description: `the number of events included per page (default ${EVENT_PAGINATION_DEFAULT_PAGE_SIZE})`,
    example: 20,
    required: false,
    type: Number,
  })
  getAllVerified(
    @Query('tags') tags: string[] | string = [],
    @Query('category') category: string,
    @Query() pagination: PaginationDto,
  ): Promise<EventsResponse> {
    const { page, pageSize } = pagination;

    return this.eventsService
      .findAllPaginated({
        tags,
        category,
        pageSize,
        requestedPage: page,
        verifiedOnly: true,
      })
      .then((paginatedEventResp) => {
        const totalEntries = paginatedEventResp.count;
        const totalPages = Math.ceil(totalEntries / pageSize);
        const nextPage = page + 1 <= totalPages ? page + 1 : undefined;

        return new EventsResponse({
          paginated: true,
          totalPages,
          nextPage,
          pageSize,
          page,
          events: paginatedEventResp.rows.map(eventModelToEventDTO),
        });
      });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get single event by id' })
  @ApiResponse({
    status: 200,
    description: 'get single event',
  })
  getEventById(
    @Param() params: FindByIdParams,
    @Query('embed') embed: string[] | string = [],
    @Req() request: Request,
  ): Promise<SingleEventResponse> {
    const id = params.id;
    const findOptions = {
      ...getOptionsForEventsServiceFromEmbedsQueryParam(embed),
      order: [literal('date_times.start_time ASC')],
    };

    return this.eventsService
      .findById(id, findOptions)
      .then((event) => Promise.resolve(event))
      .then(eventModelToEventDTO)
      .then((event) => removeSensitiveDataForNonAdmins(request, event))
      .then((event: EventDTO) => ({ event, status: 'success' }));
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new event. It will be initially un-verified',
  })
  async createUnverifiedEvent(
    @Body() newEvent: CreateEventRequest,
  ): Promise<EventModel> {
    const eventWithDateTimesInISOFormat = mapDateTimesToIso<CreateEventRequest>(
      newEvent,
      CreateEventRequest,
    );

    const submissionResult = await this.eventsService.create(
      eventWithDateTimesInISOFormat,
    );

    this.notifyViaSlackAboutNewEvent(submissionResult);

    return submissionResult;
  }

  private notifyViaSlackAboutNewEvent(newEvent: EventModel) {
    try {
      const eventPojo = (newEvent as any).dataValues;

      const eventData: string = JSON.stringify(eventPojo, null, 4);
      const messagePrefix = `(${ENV}) Review Me. Copy Me. Paste Me. Deploy Me. Love Me.:\n`;
      const message = eventData + messagePrefix;

      this.slackNotificationService.sendNotification(EVENT_SUBMIT, message);
    } catch (exSlack) {
      this.logger.error(`error notifying slack of new event: ${exSlack}`);
    }
  }
}
