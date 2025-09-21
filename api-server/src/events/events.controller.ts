import moment from 'moment';
import { Op, literal } from 'sequelize';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
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
import { ApiQuery } from '@nestjs/swagger';
import {
  EVENT_PAGINATION_DEFAULT_PAGE,
  EVENT_PAGINATION_DEFAULT_PAGE_SIZE,
  PaginationDto,
} from './dto/pagination-dto';
import { isNullOrUndefined } from '../utils';
import { validateAndExtractOptionalDateTimeFilters } from './utils/validateAndExtractOptionalDatetimeFilters';
import { VenueModel } from 'src/venues/models/venue.model';
import { DatetimeVenueModel } from './models/datetime-venue.model';
import { EventAdminMetadataModel } from './models/event-admin-metadata.model';
import isAdminUser from 'src/authentication/is-admin-user';

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
  async getAllCurrentVerified(
    @Query('tags') tags: string[] | string = [],
    @Query('category') category: string,
    @Req() request: Request,
  ): Promise<EventsResponse> {
    const isAdmin = await isAdminUser(request);

    const include = isAdmin
      ? [VenueModel, DatetimeVenueModel, EventAdminMetadataModel]
      : [VenueModel, DatetimeVenueModel];

    const findOptions = {
      include,
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
  @ApiImplicitQuery({
    name: 'dateRange',
    description:
      'Date range for filtering events (ISO 8601 format). Format: startDate/endDate. This will return all events having ' +
      'one or more start times that fall within the range provided (>= startDate & < endDate)',
    example: '2024-01-01T00:00:00.000Z/2024-12-31T23:59:59.999Z',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter events by category',
  })
  async getAllVerified(
    @Req() request: Request,
    @Query('tags') tags: string[] | string = [],
    @Query('category') category: string,
    @Query() pagination: PaginationDto,
    @Query('dateRange') dateRange?: string,
  ): Promise<EventsResponse> {
    const { page, pageSize } = pagination;

    const isUserAdmin = await isAdminUser(request);

    const [startDate, endDate] =
      validateAndExtractOptionalDateTimeFilters(dateRange);

    return this.eventsService
      .findAllPaginated({
        tags,
        category,
        pageSize,
        requestedPage: page,
        verifiedOnly: true,
        startDate,
        endDate,
        isUserAdmin,
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
      .then((event) => {
        if (isNullOrUndefined(event)) {
          throw new NotFoundException('Could not find event: ' + id);
        } else {
          return event;
        }
      })
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
