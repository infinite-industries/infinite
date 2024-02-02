export default class ExistingEventDetectionParameters {
  timeAndLocations: TimeAndLocationSearchParameters[];
}

export class TimeAndLocationSearchParameters {
  venue_id: string;
  start_time: Date;
}
