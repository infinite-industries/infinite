import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DatetimeVenueModel } from './models/datetime-venue.model';
import ExistingEventDetectionParameters from './dto/existing-event-detection-parameters';
import ExistingEventDetectionResults from './dto/existing-event-detection-results';

@Injectable()
export default class DuplicateDetectionService {
  constructor(
    @InjectModel(DatetimeVenueModel)
    private dateTimeVenueModel: typeof DatetimeVenueModel,
  ) {}

  async detectExistingEvents(
    existingEventDetectionParameters: ExistingEventDetectionParameters,
  ): Promise<ExistingEventDetectionResults> {
    const percentMatchingStartTimesAtSameVenue =
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
    });
  }

  private async getPercentMatchingStartTimesAtSameVenue({
    timeAndLocations,
  }: ExistingEventDetectionParameters): Promise<number> {
    const numberOfTimesForPossibleNewEvent = timeAndLocations.length;
    let numberOfMatchingStartTimesAtSameVenue = 0;

    for (let i = 0; i < numberOfTimesForPossibleNewEvent; i++) {
      const timeAndLocation = timeAndLocations[i];

      const { venue_id, start_time } = timeAndLocation;

      const result = await this.dateTimeVenueModel.findAll({
        where: { venue_id, start_time },
      });
      if (result.length > 0) {
        numberOfMatchingStartTimesAtSameVenue++;
      }
    }

    return (
      100 *
      (numberOfMatchingStartTimesAtSameVenue / numberOfTimesForPossibleNewEvent)
    );
  }
}
