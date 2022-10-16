import {EventModel} from "../models/event.model";
import EventDTO from "./eventDTO";
import {StartEndTimePairs} from "../../shared-types/start-end-time-pairs";
import isNotNullOrUndefined from "../../utils/is-not-null-or-undefined";

export function eventModelToEventDTO(eventModel: EventModel): EventDTO {
    const date_times: StartEndTimePairs [] = eventModel.date_times.map((dt) => {
        return {
            start_time: dt.start_time.toISOString(),
            end_time: dt.end_time.toISOString(),
            venue_id: dt.venue_id,
            optional_title: dt.optional_title
        }
    });

    return {
        address: eventModel.address,
        admission_fee: eventModel.admission_fee,
        bitly_link: eventModel.bitly_link,
        brief_description: eventModel.brief_description,
        createdAt: eventModel.createdAt,
        description: eventModel.description,
        eventbrite_link: eventModel.eventbrite_link,
        fb_event_link: eventModel.fb_event_link,
        id: eventModel.id,
        image: eventModel.image,
        links: eventModel.links,
        map_link: eventModel.map_link,
        organizer_contact: eventModel.organizer_contact,
        reviewed_by_org: eventModel.reviewed_by_org,
        slug: eventModel.slug,
        social_image: eventModel.social_image,
        tags: eventModel.tags,
        ticket_link: eventModel.ticket_link,
        title: eventModel.title,
        updatedAt: eventModel.updatedAt,
        venue_id: eventModel.venue_id,
        verified: eventModel.verified,
        website_link: eventModel.website_link,
        date_times,
        venue: isNotNullOrUndefined(eventModel.venues) ? eventModel.venues[0] : null,
    }
}
