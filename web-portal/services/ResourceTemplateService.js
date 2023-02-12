/**
 * getEmptyCalendarEvent
 *
 * returns a new calendar event for the submission form
 *
 * @returns {{website_link: string, image: string, venue: {createdAt: string, address: string, name: string, id: string, slug: string, updatedAt: string, g_map_link: string}, multi_day: boolean, address: string, brief_description: string, ticket_link: string, additional_dates: [], description: string, title: string, social_image: string, admission_fee: string, eventbrite_link: string, organizers: string, date_times: [], id: string, organizer_contact: string, fb_event_link: string, tags: []}}
 */
export function getEmptyCalendarEvent() {
  return {
    id: '',
    title: '',
    date_times: [

    ],
    image: '',
    social_image: '',
    organizers: '',
    admission_fee: 'none',
    venue: { // TODO: this may be bad
      name: '',
      id: '',
      slug: '',
      createdAt: '',
      updatedAt: '',
      g_map_link: '',
      address: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      neighborhood: ''
    },
    brief_description: '',
    description: '',
    website_link: '',
    eventbrite_link: '',
    fb_event_link: '',
    ticket_link: '',
    organizer_contact: '',
    multi_day: false,
    additional_dates: [],
    tags: []

  }
}
