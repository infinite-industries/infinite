/**
 * getEmptyCalendarEvent
 *
 * returns a new calendar event for the submission form
 *
 * @returns {{id: string, title: string, mode: string, category: string, date_times: [], venue_id: string | null, image: string, social_image: string, admission_fee: string, brief_description: string, description: string, tags: string[], website_link: string, ticket_link: string, fb_event_link: string, eventbrite_link: string, organizer_contact: string, organizers: string, multi_day: boolean, condition: string[]}}
 */
export function getEmptyCalendarEvent() {
  return {
    id: '',
    title: '',
    mode: 'in-person',
    category: '',
    date_times: [],
    venue_id: null,
    image: '',
    social_image: '',
    admission_fee: 'none',
    brief_description: '',
    description: '',
    tags: [],
    website_link: '',
    ticket_link: '',
    fb_event_link: '',
    eventbrite_link: '',
    organizer_contact: '',
    organizers: '',
    multi_day: false,
    condition: [],
  }
}
