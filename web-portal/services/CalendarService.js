/**
 * Logic for handling exchange of event information to user calendars
 * Work in Progress
 */

import moment from 'moment'

export default class CalendarService {
  /**
   * @param apiUrl String
   * @param event Object
   * @param service String
   */
  static generate(apiUrl, event, service) {
    const serviceUrl = apiUrl + '/calendaring/create-ics-file'
    const title = event.title
    const desc = event.brief_description
    const location = includeEventLocation(event)
      ? (event.venue ? `${event.venue.name}, ${event.address}` : event.address)
      : null
    let timeStart = event.date_times[0].start_time
    let timeEnd = event.date_times[0].end_time

    // generate file for download except for Google Cal,
    // which requires hitting a URL
    if (serviceUsesEndpoint(service)) {
      // TODO: can we do this with an axios call?
      window.location = serviceUrl +
        `?title=${encodeURIComponent(title)}` +
        `&description=${encodeURIComponent(desc)}` +
        (location ? `&location=${encodeURIComponent(location)}` : '') +
        `&time_start=${encodeURIComponent(timeStart)}` +
        `&time_end=${encodeURIComponent(timeEnd)}`
    } else {
      timeStart = moment(timeStart).format('YYYYMMDDTHHmmss')
      timeEnd = moment(timeEnd).format('YYYYMMDDTHHmmss')

      window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}` +
        `&dates=${encodeURIComponent(timeStart)}/${encodeURIComponent(timeEnd)}` +
        `&details=${encodeURIComponent(desc)}` +
        (location ? `&location=${encodeURIComponent(location)}` : '')
      )
    }
  }
}

function includeEventLocation(event) {
  return !(
    (event.venue && event.venue.name === 'Remote Event') ||
    (event.tags && (event.tags.includes('category:online-resource') || event.tags.includes('mode:online')))
  )
}

function serviceUsesEndpoint(service) {
  return service !== 'Google Cal'
}
