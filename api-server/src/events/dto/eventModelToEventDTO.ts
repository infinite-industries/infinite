import { EventModel } from '../models/event.model';
import EventDTO from './eventDTO';
import isNotNullOrUndefined from '../../utils/is-not-null-or-undefined';
import { DatetimeVenueModel } from '../models/datetime-venue.model';
import { PartnerDTO } from '../../users/dto/partner-dto';

export function eventModelToEventDTO(eventModel: EventModel): EventDTO {
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
    category: eventModel.category,
    condition: eventModel.condition,
    mode: eventModel.mode,
    ticket_link: eventModel.ticket_link,
    title: eventModel.title,
    updatedAt: eventModel.updatedAt,
    venue_id: eventModel.venue_id,
    owning_partner_id: eventModel.owning_partner_id,
    verified: eventModel.verified,
    website_link: eventModel.website_link,
    multi_day: eventModel.multi_day,
    date_times,
    venue: isNotNullOrUndefined(eventModel.venues)
      ? eventModel.venues[0]
      : null,
    event_admin_metadata: isNotNullOrUndefined(eventModel.event_admin_metadata)
      ? {
          is_problem: eventModel.event_admin_metadata.is_problem,
          createdAt: eventModel.event_admin_metadata.createdAt,
          updatedAt: eventModel.event_admin_metadata.updatedAt,
        }
      : undefined,
    owning_partner: isNotNullOrUndefined(eventModel.owning_partner)
      ? new PartnerDTO({
          id: eventModel.owning_partner.id,
          name: eventModel.owning_partner.name,
          logo_url: eventModel.owning_partner.logo_url,
          createdAt: eventModel.owning_partner.createdAt,
          updatedAt: eventModel.owning_partner.updatedAt,
        })
      : undefined,
  };
}
