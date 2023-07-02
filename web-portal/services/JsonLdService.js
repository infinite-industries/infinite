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

    const eventMode = tags.find(t => t.startsWith('mode:'))?.split(':')[1]

    // if something doesn't have times, it's not an Event for purposes
    // of Schema.org's schemas; for now just bail but maybe there's a
    // type we could use later
    if (!firstStartTime) return null

    return {
      '@context': 'http://schema.org',
      '@type': 'Event',
      'name': title,
      'description': description,
      'startDate': firstStartTime,
      'endDate': lastEndTime,
      'image': image,
      ...(venue ? { 'location': this.forVenue(venue, eventMode) } : null),
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
      ...(type === 'Place' ? { 'address': address } : null)
    }
  }
}
