import { v4 as uuidv4 } from 'uuid';
import * as moment from "moment-timezone";
import {Injectable} from "@nestjs/common";

@Injectable()
export default class CalendaringService {
    generateICSFileText(summary: string, dtStart: string, dtEnd: string, description: string, location?: string): string {
        const icsEntries = ['BEGIN:VCALENDAR',
            'VERSION:2.0',
            `CALSCALE:${ICS_FILE_SETTINGS.calscale}`,
            `PRODID:${ICS_FILE_SETTINGS.prodid}`,
            'METHOD:PUBLISH',
            'X-PUBLISHED-TTL:PT1H',
            'BEGIN:VEVENT',
            `UID:${uuidv4()}`,
            `SUMMARY:${summary}`,
            `DTSTAMP:${moment().utc().format('YYYYMMDDTHHmmss')}Z`,
            `DTSTART:${moment(dtStart).format('YYYYMMDDTHHmmss')}`,
            `DTEND:${moment(dtEnd).format('YYYYMMDDTHHmmss')}`,
            `DESCRIPTION:${description}`,
            location ? `LOCATION:${location}` : '',
            'END:VEVENT',
            'END:VCALENDAR']

        const withoutEmptyEntries = stripEmpty(icsEntries)

        return withoutEmptyEntries.join('\n')
    }
}

export const ICS_FILE_SETTINGS = {
    calscale: 'GREGORIAN',
    prodid: 'InfiniteIndustries/ics',
    timezone: 'America/New_York' // need to figure out a more graceful way to deal with timezone
}

function stripEmpty(icsEntries: string [] ) {
    return icsEntries.filter(l => !!l);
}
