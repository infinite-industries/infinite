export default class ExistingEventDetectionParameters {
  timeAndLocations: TimeAndLocationSearchParameters[];
}

export class TimeAndLocationSearchParameters {
  venueId: string;
  startTime: Date;
}
