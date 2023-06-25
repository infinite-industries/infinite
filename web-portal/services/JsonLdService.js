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

    return {
      '@context': 'http://schema.org',
      '@type': 'Event',
      'name': title,
      'description': description,
      'startDate': firstStartTime,
      'endDate': lastEndTime,
      'image': image,
      ...(venue ? { 'location': this.forVenue(venue) } : null),
      ...(eventStatus ? { eventStatus: `https://schema.org/Event${eventStatus}` } : null),
      ...(event.ticket_link || event.eventbrite_link
        ? {
            'offers': {
              '@type': 'Offer',
              'url': event.ticket_link || event.eventbrite_link
            }
          }
        : null)
    }
  }

  static forVenue(venue) {
    if (!venue) return

    return {
      '@type': 'Place',
      'name': venue.name,
      // TODO: how to figure out URL
      // 'sameAs': '????',
      'address': {
        // TODO: probably need to consider edge-cases with e.g.
        // WRFL / WUKY pseudo-venues
        '@type': 'PostalAddress',
        'addressLocality': venue.city,
        'addressRegion': venue.state,
        'postalCode': venue.zip,
        'streetAddress': venue.street
      }
    }
  }
}
