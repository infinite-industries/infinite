import { EventModel } from '../models/event.model';
import EventDTO from './eventDTO';
import isNotNullOrUndefined from '../../utils/is-not-null-or-undefined';
import { DatetimeVenueModel } from '../models/datetime-venue.model';

export function eventModelToEventDTO(eventModel: EventModel): EventDTO {
  console.log(
    '!!! the fuck: ' + JSON.stringify(eventModel.date_times, null, 4),
  );
  const date_times: DatetimeVenueModel[] = isNotNullOrUndefined(
    eventModel.date_times,
  )
    ? eventModel.date_times.map((dt) => {
        return new DatetimeVenueModel({
          start_time: dt.start_time,
          end_time: dt.end_time,
          venue_id: dt.venue_id,
          timezone: dt.timezone,
          optional_title: dt.optional_title,
        });
      })
    : [];

  return {
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
    venue: isNotNullOrUndefined(eventModel.venues)
      ? eventModel.venues[0]
      : null,
  };
}
