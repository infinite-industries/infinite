
const SCHEMA = 'https://schema.org'

export default class JsonLdService {
  static forEvent(event) {
    if (!event) return null

    const title = event.title
    const description = event.brief_description || ''
    const firstStartTime = event.date_times.length > 0
      ? event.date_times[0].start_time
      : null
    const lastEndTime = event.date_times.length > 0
      ? event.date_times[event.date_times.length - 1].end_time
      : null
    const venue = event.venue
    const image = event.image
    const tags = event.tags // TODO: this will change w/ B's work

    const eventStatus = tags.includes('condition:cancelled')
      ? 'Cancelled'
      : (tags.includes('condition:postponed') ? 'Postponed' : null)

    const soldOut = tags.includes('condition:sold-out')

    const eventMode = tags.find(t => t.startsWith('mode:'))?.split(':')[1]

    // if something doesn't have times, it's not an Event for purposes
    // of Schema.org's schemas; for now just bail but maybe there's a
    // type we could use later
    if (!firstStartTime) return null

    return {
      '@context': SCHEMA,
      '@type': 'Event',
      'name': title,
      'description': description,
      'startDate': firstStartTime,
      'endDate': lastEndTime,
      'image': image,
      'eventAttendanceMode': `${SCHEMA}/${eventMode === 'in-person' ? 'Offline' : eventMode === 'online' ? 'Online' : 'Mixed'}EventAttendanceMode`,
      ...(venue ? { 'location': this.forVenue(venue, eventMode) } : null),
      ...(eventStatus ? { eventStatus: `${SCHEMA}/Event${eventStatus}` } : null),
      ...(event.ticket_link || event.eventbrite_link
        ? {
            'offers': {
              '@type': 'Offer',
              'url': event.ticket_link || event.eventbrite_link,
              'availability': `${SCHEMA}/${soldOut ? 'SoldOut' : 'InStock'}`
            }
          }
        : null),
      ...(event.website_link || event.ticket_link || event.fb_event_link || event.eventbrite_link
        ? {
            'subjectOf': [
              event.website_link ? this.subjectForUrl(event.website_link, 'Event Website') : null,
              event.ticket_link ? this.subjectForUrl(event.ticket_link, 'Ticket Link') : null,
              event.fb_event_link ? this.subjectForUrl(event.fb_event_link, 'Facebook Event') : null,
              event.eventbrite_link ? this.subjectForUrl(event.ticket_link, 'Eventbrite Link') : null
            ].filter(s => !!s)
          }
        : null)
    }
  }

  static forVenue(venue, mode) {
    if (!venue) return

    // TODO: how to handle hybrid -- two locations, physical + virtual?
    const type = mode === 'online' ? 'VirtualLocation' : 'Place'

    const address = {
      // TODO: probably need to consider edge-cases with e.g.
      // WRFL / WUKY pseudo-venues
      '@type': 'PostalAddress',
      'addressLocality': venue.city,
      'addressRegion': venue.state,
      'postalCode': venue.zip,
      'streetAddress': venue.street
    }

    return {
      '@type': type,
      'name': venue.name,
      // TODO: how to figure out URL -- may need to add to data model
      // 'sameAs': '????',
      ...(type === 'Place' ? { 'address': address } : null),
      ...(type === 'Place' && venue.g_map_link ? { 'hasMap': venue.g_map_link } : null)
    }
  }

  static subjectForUrl(url, name) {
    return {
      '@type': 'WebPage',
      url,
      name
    }
  }
}
