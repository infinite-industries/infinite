const frisby = require('frisby')
const eventFaker = require('../models/fakers/event.faker')
const venueFaker = require('../models/fakers/venue.faker')
const sequelize = require(__dirname + '/../utils/connection')()
const { createEvent, deleteAllEvents } = require('../test-helpers/events')
const { createVenue, deleteAllVenues } = require('../test-helpers/venue')

const today = new Date(Date.now())
const window = 24 // maximum hours in past events will remain visible for
const apiUrl = 'http://localhost:3003'

afterAll(() => {
  sequelize.close()
})


beforeEach(async () => {
  await deleteAllEvents()
  await deleteAllVenues()
})

it('can query current-events', async function () {
  return frisby.get(apiUrl +'/events/current/verified')
    .expect('status', 200)
})

it('returns only verified events', async function() {
  const dateTimesForEventInFuture1 = getDateTimesInFuture()
  const dateTimesForEventInFuture2 = getDateTimesInFuture()

  const venue = await createVenue(venueFaker.venue())
  const eventVerified = await createEvent(
    eventFaker.event(venue.id, true, dateTimesForEventInFuture1))
  const eventNonVerified = await createEvent(
    eventFaker.event(venue.id, false, dateTimesForEventInFuture2))

  return frisby.get(apiUrl + '/events/current/verified')
    .expect('status', 200)
    .then(async (response) => {
      // should only get back 2 of the three events
      expect(response.json.events.length).toEqual(1)

      // should only have the verified event in the list
      expect(response.json.events.map(event => event.id)).toEqual([eventVerified.id])
    })
})

it('returns only events in the future or recent past', async function() {
  const dateTimesForEventTooFarInPast = getDateTimesInPastBeyondWindow()
  const dateTimesForEventInFuture = getDateTimesInFuture()
  const dateTimesForEvenInPast = getDateTimesInPastButInsideWindow()

  // create a venue to associate the events with
  const venue = await createVenue(venueFaker.venue())

  const eventInFuture = await createEvent(
    eventFaker.event(venue.id, true, dateTimesForEventInFuture))
  const eventInRecentPast = await createEvent(eventFaker.event(venue.id, true, dateTimesForEvenInPast))
  const eventInDistantPast = await createEvent(eventFaker.event(venue.id, true, dateTimesForEventTooFarInPast))

  return frisby.get(apiUrl + '/events/current/verified')
    .expect('status', 200)
    .then(async (response) => {
      // should only get back 2 of the three events
      expect(response.json.events.length).toEqual(2)

      // should be the correct two events with oldest first
      expect(response.json.events.map(event => event.id)).toEqual([eventInRecentPast.id, eventInFuture.id])
    })
})

it('sorts multi-date events by most recent non-expired start-time', async () => {
  // order in this list shouldn't matter
  const multiDayDateTimes = [,
    getDateTimePair(getTimePlusX(today, 11)),
    getDateTimePair(getTimePlusX(today, -47)),
    getDateTimePair(getTimePlusX(today, 6))
  ]

  const singleDayEventTimes1 = [
    getDateTimePair(getTimePlusX(today, 3))
  ]

  const singleDayEventTimes2 = [
    getDateTimePair(getTimePlusX(today, 7))
  ]

  // create a venue to associate the events with
  const venue = await createVenue(venueFaker.venue())

  const multiDayEvent = await createEvent(
    eventFaker.event(venue.id, true, multiDayDateTimes))
  const singleDayEvent1 = await createEvent(
    eventFaker.event(venue.id, true, singleDayEventTimes1)
  )
  const singleDayEvent2 = await createEvent(
    eventFaker.event(venue.id, true, singleDayEventTimes2)
  )

  return frisby.get(apiUrl + '/events/current/verified')
    .expect('status', 200)
    .then(async (response) => {
      // should only get back 2 of the three events
      expect(response.json.events.length).toEqual(3)

      // should be the correct two events with oldest first
      expect(response.json.events.map(event => event.id))
        .toEqual([
          singleDayEvent1.id,
          multiDayEvent.id,
          singleDayEvent2.id
        ])
    })
})

it('filters expired events from multi-day events and finds correct first day/last day times', async () => {
  const firstDayTime =  getDateTimePair(getTimePlusX(today, -window + 1))
  const secondDayTime = getDateTimePair(getTimePlusX(today, -window + 2))
  // order in this list shouldn't matter
  const multiDayDateTimes = [
    secondDayTime, // will show up
    getDateTimePair(getTimePlusX(today, -window - 1)),
    getDateTimePair(getTimePlusX(today, -window - 2)),
    firstDayTime // will show up
  ]

  const venue = await createVenue(venueFaker.venue())

  await createEvent(
    eventFaker.event(venue.id, true, multiDayDateTimes))

  return frisby.get(apiUrl + '/events/current/verified')
    .expect('status', 200)
    .then(async (response) => {
      // should only get back 2 of the three events
      expect(response.json.events.length).toEqual(1)

      const event = response.json.events[0]
      const remainingTimes = event.date_times

      expect(remainingTimes.length).toEqual(2)
      expect(remainingTimes[0].start_time).toEqual(firstDayTime.start_time)
      expect(remainingTimes[1].start_time).toEqual(secondDayTime.start_time)
      expect(event.first_day_start_time).toEqual(firstDayTime.start_time)
      expect(event.last_day_end_time).toEqual(secondDayTime.end_time)
    })
})

it('returns events with all expected field values', async () => {
  const futureTime = getDateTimePair(getTimePlusX(today, 1))
  const venue = await createVenue(venueFaker.venue())

  const dbEvent = await createEvent(
    eventFaker.event(venue.id, true, [futureTime]))

  return frisby.get(apiUrl + '/events/current/verified')
    .expect('status', 200)
    .then(async (response) => {
      // should only get back 2 of the three events
      expect(response.json.events.length).toEqual(1)

      const event = response.json.events[0]

      // fields returned should match what was saved to the db
      expect(event.uuid).toEqual(dbEvent.uuid)
      expect(event.venue_id).toEqual(dbEvent.venue_id)
      expect(event.verified).toEqual(dbEvent.verified)
      expect(event.title).toEqual(dbEvent.title)
      expect(event.slug).toEqual(dbEvent.slug)
      expect(event.multi_day).toEqual(dbEvent.multi_day)
      expect(event.date_times).toEqual(dbEvent.date_times)
      expect(event.image).toEqual(dbEvent.image)
      expect(event.social_image).toEqual(dbEvent.social_image)
      expect(event.admission_fee).toEqual(dbEvent.admission_fee)
      expect(event.address).toEqual(dbEvent.address)
      expect(event.map_link).toEqual(dbEvent.map_link)
      expect(event.brief_description).toEqual(dbEvent.brief_description)
      expect(event.description).toEqual(dbEvent.description)
      expect(event.links).toEqual(dbEvent.links)
      expect(event.website_link).toEqual(dbEvent.website_link)
      expect(event.ticket_link).toEqual(dbEvent.ticket_link)
      expect(event.fb_event_link).toEqual(dbEvent.fb_event_link)
      expect(event.eventbrite_link).toEqual(dbEvent.eventbrite_link)
      expect(event.bitly_link).toEqual(dbEvent.bitly_link)
      expect(event.tags).toEqual(dbEvent.tags)
      expect(event.reviewed_by_org).toEqual(dbEvent.reviewed_by_org)

      // except this one should be empty for non-admins
      expect(event.organizer_contact).toBeUndefined()
    })
})

function getTimePlusX(time, deltaHours) {
  const incrementedTime = new Date(time)
  incrementedTime.setHours(incrementedTime.getHours() + deltaHours)

  return incrementedTime
}

function getDateTimePair(startTime) {
  const startTimeCopy = new Date(startTime)
  const endTime = new Date(startTime)
  endTime.setHours(endTime.getHours() + 1)

  return {
    start_time: startTimeCopy.toISOString(),
    end_time: endTime.toISOString()
  }
}

function getDateTimesInFuture() {
  const startTime = new Date(today)
  startTime.setDate(today.getDate() + 1)

  const endTime = new Date(startTime)
  endTime.setHours(startTime.getHours() + 1)

  return [{
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString()
  }]
}

function getDateTimesInPastBeyondWindow() {
  const startTime = new Date(today)
  startTime.setHours(startTime.getHours() - window -1)

  const endTime = new Date(startTime)
  endTime.setHours(startTime.getHours() + 1)

  return [{
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString()
  }]
}

function getDateTimesInPastButInsideWindow() {
  const startTime = new Date(today)
  startTime.setHours(startTime.getHours() - window + 1)

  const endTime = new Date(startTime)
  endTime.setHours(startTime.getHours() + 1)

  return [{
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString()
  }]
}
