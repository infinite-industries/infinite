import {Event} from '../events/dto/event.model'
import {HttpException} from "@nestjs/common";

export function mapDateTimesToIso(event: Event): Event {
    if (event && event.date_times) {
        try {
            const convertedEvent = {
                ...event,
                date_times: event.date_times.map(dtEntry => {
                    return {
                        ...dtEntry,
                        start_time: new Date(dtEntry.start_time).toISOString(),
                        end_time: new Date(dtEntry.end_time).toISOString()
                    }
                })
            }

            return new Event(convertedEvent)
        } catch (ex) {
            throw new HttpException('could not parse date formats', 400);
        }
    }
}
