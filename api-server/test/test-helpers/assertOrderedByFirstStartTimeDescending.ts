// This type should be very close EventDTO but is a serialized/deserialized representation
// Objects that don't translate direct to json will be off, Dates will be strings for example
import EventDTO from '../../src/events/dto/eventDTO';
import { Nullable } from '../../src/utils/NullableOrUndefinable';

export function assertOrderedByFirstStartTimeDescending(events: EventDTO[]) {
  let lastFirstStartTime: Nullable<string> = null;

  events.forEach((event, ndx: number) => {
    // find first start time
    const firstStartTime = event.date_times.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    )[0].start_time as unknown as string;

    expect(firstStartTime).not.toBeNull();
    expect(firstStartTime).not.toBeUndefined();

    if (ndx > 0) {
      // check that first start time is greater than the last first start time
      expect(new Date(lastFirstStartTime).getTime()).toBeGreaterThan(
        new Date(firstStartTime).getTime(),
      );
    }

    lastFirstStartTime = firstStartTime;
  });
}
