import { EventModel } from '../../src/events/models/event.model';

export function assertEventsEqual(
  actualReturned: any,
  expectedEvent: EventModel,
  compareAuthenticatedUser = true,
) {
  expect(actualReturned.id).toEqual(expectedEvent.id);
  expect(actualReturned.verified).toEqual(expectedEvent.verified);
  expect(actualReturned.title).toEqual(expectedEvent.title);
  expect(actualReturned.multi_day).toEqual(expectedEvent.multi_day);
  expect(actualReturned.image).toEqual(expectedEvent.image);
  expect(actualReturned.social_image).toEqual(expectedEvent.social_image);
  expect(actualReturned.admission_fee).toEqual(expectedEvent.admission_fee);

  if (compareAuthenticatedUser) {
    expect(actualReturned.organizer_contact).toEqual(
      expectedEvent.organizer_contact,
    );
  } else {
    // we filter organizer contact on un-authenticated endpoints, in such cases it should be undefined
    expect(actualReturned.organizer_contact).toEqual(undefined);
  }

  expect(actualReturned.brief_description).toEqual(
    expectedEvent.brief_description,
  );
  expect(actualReturned.description).toEqual(expectedEvent.description);
  expect(actualReturned.links).toEqual(expectedEvent.links);
  expect(actualReturned.website_link).toEqual(expectedEvent.website_link);
  expect(actualReturned.ticket_link).toEqual(expectedEvent.ticket_link);
  expect(actualReturned.fb_event_link).toEqual(expectedEvent.fb_event_link);
  expect(actualReturned.eventbrite_link).toEqual(expectedEvent.eventbrite_link);
  expect(actualReturned.bitly_link).toEqual(expectedEvent.bitly_link);
  expect(actualReturned.tags).toEqual(expectedEvent.tags);
  expect(actualReturned.reviewed_by_org).toEqual(expectedEvent.reviewed_by_org);
}
