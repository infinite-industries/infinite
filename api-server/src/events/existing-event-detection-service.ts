import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DatetimeVenueModel } from './models/datetime-venue.model';
import ExistingEventDetectionParameters from './dto/existing-event-detection-parameters';
import ExistingEventDetectionResults, {
  CandidateEvent,
} from './dto/existing-event-detection-results';
import { EventModel } from './models/event.model';
import { INFINITE_WEB_PORTAL_BASE_URL } from '../constants';
import { Op, WhereOptions } from 'sequelize';
import isNotNullOrUndefined from '../utils/is-not-null-or-undefined';

@Injectable()
export default class ExistingEventDetectionService {
  constructor(
    @InjectModel(DatetimeVenueModel)
    private dateTimeVenueModel: typeof DatetimeVenueModel,
    @InjectModel(EventModel)
    private eventModel: typeof EventModel,
  ) {}

  async detectExistingEventsByTimeAndLocation(
    existingEventDetectionParameters: ExistingEventDetectionParameters,
  ): Promise<ExistingEventDetectionResults> {
    const [percentMatchingStartTimesAtSameVenue, candidateEvents] =
      await this.getPercentMatchingStartTimesAtSameVenue(
        existingEventDetectionParameters,
      );

    return new ExistingEventDetectionResults({
      isLikelyExisting: percentMatchingStartTimesAtSameVenue > 50,
      confidence: percentMatchingStartTimesAtSameVenue,
      factors: {
        percentMatchingStartTimesAtSameVenue:
          percentMatchingStartTimesAtSameVenue,
      },
      candidateEvents,
    });
  }

  private async getPercentMatchingStartTimesAtSameVenue({
    timeAndLocations,
    excludeIds,
  }: ExistingEventDetectionParameters): Promise<[number, CandidateEvent[]]> {
    const numberOfTimesForPossibleNewEvent = timeAndLocations.length;
    let numberOfMatchingStartTimesAtSameVenue = 0;
    const candidateEventIds: Set<string> = new Set();

    for (let i = 0; i < numberOfTimesForPossibleNewEvent; i++) {
      const timeAndLocation = timeAndLocations[i];

      const { venueId, startTime } = timeAndLocation;

      const where: WhereOptions<DatetimeVenueModel> = {
        venue_id: venueId,
        start_time: startTime,
      };

      if (isNotNullOrUndefined(excludeIds) && excludeIds.length > 0) {
        // add id exclusions to to the query when present
        where.event_id = {
          [Op.notIn]: isNotNullOrUndefined(excludeIds) ? excludeIds : [],
        };
      }

      const result = await this.dateTimeVenueModel.findAll({ where });

      if (result.length > 0) {
        numberOfMatchingStartTimesAtSameVenue++;

        result.forEach(({ event_id }) => {
          candidateEventIds.add(event_id);
        });
      }
    }

    const candidateEvents: CandidateEvent[] =
      await this.resolveCandidateEventIds(candidateEventIds);

    const percentMatching =
      100 *
      (numberOfMatchingStartTimesAtSameVenue /
        numberOfTimesForPossibleNewEvent);

    return [percentMatching, candidateEvents];
  }

  private async resolveCandidateEventIds(
    candidateEventIds: Set<string>,
  ): Promise<CandidateEvent[]> {
    const events = await this.eventModel.findAll({
      where: { id: Array.from(candidateEventIds) },
    });

    return events.map(({ id, title, brief_description, verified }) => ({
      title,
      briefDescription: brief_description,
      verified,
      url: new URL(`/events/${id}`, INFINITE_WEB_PORTAL_BASE_URL).toString(),
    }));
  }
}
