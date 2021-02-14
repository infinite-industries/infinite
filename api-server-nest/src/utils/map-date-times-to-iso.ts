import {Event} from '../events/models/event.model'
import {HttpException} from "@nestjs/common";
import {CreateEventRequest} from "../events/dto/create-event-request";

export function mapDateTimesToIso <T extends CreateEventRequest>(event: T, t: new (any) => T): T {
    if (event && event.date_times) {
        try {
            const convertedEvent: CreateEventRequest = {
                ...event,
                date_times: event.date_times.map(dtEntry => {
                    return {
                        ...dtEntry,
                        start_time: new Date(dtEntry.start_time).toISOString(),
                        end_time: new Date(dtEntry.end_time).toISOString()
                    }
                })
            }

            return new t(convertedEvent)
        } catch (ex) {
            throw new HttpException('could not parse date formats', 400);
        }
    }
}
