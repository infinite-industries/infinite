import JsonLdService from '@/services/JsonLdService'

describe('JsonLdService', () => {
  test.skip('returns correct metadata for event', () => {
    // TODO: what's the best generic test case?
    // Probably mode:in-person; should we be specific?
    // Or maybe only test the common stuff here like title etc,
    // then a separate test case for in-person specifically
  })

  // TODO: additional test as described below
  // these are suggestions based on a quick reading of the code;
  // there might be additional useful test cases
  // the forVenue tests below should be a good starting point
  // note that there's a test.each, but TBD whether the result is more
  // legible than the long form

  // test: returns correct metadata for online event

  // test: returns correct metadata for hybrid event

  // test: returns correct metadata for multi-time event
  // (specifically, startDate = first start_time and endDate = last end_time)

  // test: returns null for event without times e.g. category:online-resource

  // test: returns correct metadata for postponed|cancelled event

  // test: returns correct metadata for sold-out event

  // test: returns correct relationships for (each type of *_link field)
  // (note that ticket_link and eventbrite_link produce two output fields,
  //  an 'offer' and an entry in 'subjectOf')

  test('returns correct metadata for venue', () => {
    const venue = {
      id: 'de605ae6-a9c2-44b1-b957-252223c04c7f',
      name: 'Test Venue',
      street: '123 Test',
      city: 'Place',
      state: 'KY',
      zip: '40000',
      g_map_link: 'https://google.com/maps/etc'
    }
    expect(JsonLdService.forVenue(venue, 'in-person')).toEqual({
      '@type': 'Place',
      name: venue.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: venue.city,
        addressRegion: venue.state,
        postalCode: venue.zip,
        streetAddress: venue.street
      },
      hasMap: venue.g_map_link
    })
  })

  test('returns correct metadata for online venue', () => {
    const venue = {
      id: 'de605ae6-a9c2-44b1-b957-252223c04c7f',
      name: 'Test Venue',
      street: '123 Test',
      city: 'Place',
      state: 'KY',
      zip: '40000',
      g_map_link: 'https://google.com/maps/etc'
    }
    expect(JsonLdService.forVenue(venue, 'online')).toEqual({
      '@type': 'VirtualLocation',
      name: venue.name
    })
  })

  test('returns correct metadata for venue without g_map_link', () => {
    const venue = {
      id: 'de605ae6-a9c2-44b1-b957-252223c04c7f',
      name: 'Test Venue',
      street: '123 Test',
      city: 'Place',
      state: 'KY',
      zip: '40000'
    }
    const result = JsonLdService.forVenue(venue, 'in-person')
    expect(result).toEqual({
      '@type': 'Place',
      name: venue.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: venue.city,
        addressRegion: venue.state,
        postalCode: venue.zip,
        streetAddress: venue.street
      }
    })
    expect(result).not.toHaveProperty('hasMap')
  })
})
