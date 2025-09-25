import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../authentication/AdminAuth.guard';
import { EventIdResponse } from './dto/event-id-response';
import { SingleEventResponse } from './dto/single-event-response';
import { EventsService } from './events.service';
import { UpdateEventRequest } from './dto/update-event-request';
import { EventModel } from './models/event.model';
import { mapDateTimesToIso } from '../utils/map-date-times-to-iso';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import FindByIdParams from '../dto/find-by-id-params';
import { eventModelToEventDTO } from './dto/eventModelToEventDTO';
import UpsertEventAdminMetadataRequest from './dto/upsert-event-admin-metadata-request';
import {
  EventAdminMetadataListResponse,
  EventAdminMetadataSingleResponse,
} from './dto/event-admin-metadata-response';
import { EventsResponse } from './dto/events-response';
import { getOptionsForEventsServiceFromEmbedsQueryParam } from '../utils/get-options-for-events-service-from-embeds-query-param';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import {
  EVENT_PAGINATION_DEFAULT_PAGE,
  EVENT_PAGINATION_DEFAULT_PAGE_SIZE,
  PaginationDto,
} from './dto/pagination-dto';
import { validateAndExtractOptionalDateTimeFilters } from './utils/validateAndExtractOptionalDatetimeFilters';
import { AuthenticatedUserGuard } from '../authentication/authenticated-user.guard';
import { PartnerAdminGuard } from '../authentication/PartnerAdmin.guard';
import UsersService from '../users/users.service';
import { RequestWithUserInfo } from '../users/dto/RequestWithUserInfo';
import { Op } from 'sequelize';

@Controller(`${VERSION_1_URI}/authenticated/events`)
@UseGuards(AuthenticatedUserGuard)
@ApiTags('events -- authenticated')
@ApiBearerAuth()
@ApiResponse({ status: 403, description: 'Forbidden' })
export default class EventsAuthenticatedController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get events, both verified and non (admin only)' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
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
  getAll(
    @Query('tags') tags: string[] | string = [],
    @Query('category') category: string,
    @Query() pagination: PaginationDto,
    @Query('dateRange') dateRange?: string,
  ): Promise<EventsResponse> {
    const { page, pageSize } = pagination;

    const [startDate, endDate] =
      validateAndExtractOptionalDateTimeFilters(dateRange);

    return this.eventsService
      .findAllPaginated({
        tags,
        category,
        pageSize,
        requestedPage: page,
        verifiedOnly: false,
        startDate,
        endDate,
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

  // this probably shouldn't be needed long term, we should just fetch this with the event
  @Get('/admin-metadata')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get all admin metadata for all events' })
  getEventAdminMetadata(): Promise<EventAdminMetadataListResponse> {
    return this.eventsService
      .getAllEventMetaData()
      .then(
        (eventAdminMetadata) =>
          new EventAdminMetadataListResponse({ eventAdminMetadata }),
      );
  }

  @Get('non-verified')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Get events that have not yet been verified (admin only)',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  getAllNonVerified(
    @Query('embed') embed: string[] | string = [],
  ): Promise<EventsResponse> {
    const findOptions = {
      ...getOptionsForEventsServiceFromEmbedsQueryParam(embed),
      where: { verified: false },
    };

    return this.eventsService
      .findAll(findOptions)
      .then((events) => events.map(eventModelToEventDTO))
      .then((events) => new EventsResponse({ events }));
  }

  @Get('non-verified-for-partners')
  @UseGuards(PartnerAdminGuard)
  @ApiOperation({
    summary: `Get events that have not yet been verified filtered by the partners you belong
    to (partner-admin or admin only). If you are an infinite admin this will act just like non-verified`,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  async getAllNonVerifiedForPartnersBelongToTheCurrentUser(
    @Query('embed') embed: string[] | string = [],
    @Req() request: RequestWithUserInfo,
  ): Promise<EventsResponse> {
    const user = request.userInformation;
    // await this.userService.ensureCurrentUserByName(request);

    if (user.isInfiniteAdmin) {
      // infinite admins have access to all partners, it may be useful for admins
      // to filter by a given partner, but we can implement that as a separate filter
      // somewhere, this event is specifically a convenience to give an easy way
      // to get all un-verified events a partner-admin has access to
      return this.getAllNonVerified(embed);
    }

    const partnerIds = user.partners?.map((partner) => partner.id) || [];

    const findOptions = {
      ...getOptionsForEventsServiceFromEmbedsQueryParam(embed),
      where: {
        verified: false,
        owning_partner_id: {
          [Op.in]: partnerIds,
        },
      },
    };

    return this.eventsService
      .findAll(findOptions)
      .then((events) => events.map(eventModelToEventDTO))
      .then((events) => new EventsResponse({ events }));
  }

  @Get('/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Get a single event with no filters applied (authenticated only)',
  })
  @ApiResponse({
    status: 200,
    description: 'get single event',
  })
  getById(@Param() params: { id: string }): Promise<SingleEventResponse> {
    const id = params.id;

    return this.eventsService
      .findById(id)
      .then(eventModelToEventDTO)
      .then((event) => ({ event, status: 'success' }));
  }

  @Put(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update fields on an existing event' })
  @ApiImplicitParam({ name: 'id', type: String })
  updateEvent(
    @Param() params: FindByIdParams,
    @Body() updatedValues: UpdateEventRequest,
  ): Promise<EventModel> {
    const id = params.id;

    const eventWithDateTimesInISOFormat = mapDateTimesToIso<UpdateEventRequest>(
      updatedValues,
      UpdateEventRequest,
    );

    return this.eventsService
      .update(id, eventWithDateTimesInISOFormat)
      .then((response) => response.updatedEntities[0]);
  }

  @Put('/verify/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Verify the event, making it visible to the public',
  })
  @ApiImplicitParam({ name: 'id', type: String })
  verifyEvent(@Param() params: FindByIdParams): Promise<EventModel> {
    const id = params.id;

    return this.eventsService
      .update(id, { verified: true })
      .then((response) => response.updatedEntities[0]);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Delete the event' })
  @ApiImplicitParam({ name: 'id', type: String })
  deleteEvent(@Param() params: FindByIdParams): Promise<EventIdResponse> {
    const id = params.id;

    return this.eventsService
      .delete(id)
      .then(() => ({ id, status: 'success' }));
  }

  @Put(':id/admin-metadata')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Set admin metadata information for an event' })
  @ApiImplicitParam({ name: 'id', type: String })
  upsertAdminMetadata(
    @Param() { id }: FindByIdParams,
    @Body() updatedState: UpsertEventAdminMetadataRequest,
  ): Promise<EventAdminMetadataSingleResponse> {
    return this.eventsService
      .upsertEventMetadata(id, updatedState)
      .then(
        (eventAdminMetadata) =>
          new EventAdminMetadataSingleResponse({ eventAdminMetadata }),
      );
  }
}
