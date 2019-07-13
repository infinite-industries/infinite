/**
 * Logic for handling exchange of event information to user calendars
 * Work in Progress
 */

export default class CalendarService {
  /**
   * @param event Object
   * @param service String
   */
  static generate(event, service) {
    const title = event.title
    const desc = event.brief_description
    const location = event.address
    let time_start = event.date_times.start_time
    let time_end = event.date_times.end_time

    // generate file for download except for Google Cal,
    // which requires hitting a URL
    if (serviceUsesEndpoint(service)) {
      // TODO: can we do this with an axios call?
      window.location = `/calendar?title=${encodeURIComponent(title)}&description=${encodeURIComponent(desc)}&location=${encodeURIComponent(location)}&time_start=${encodeURIComponent(time_start)}&time_end=${encodeURIComponent(time_end)}`
    } else {
      time_start = time_start || time_start // moment(time_start).format('YYYYMMDDTHHmmss')
      time_end = time_end || time_end // moment(time_end).format('YYYYMMDDTHHmmss')
      window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${encodeURIComponent(time_start)}/${encodeURIComponent(time_end)}&details=${encodeURIComponent(desc)}&location=${encodeURIComponent(location)}`)
    }
  }
}

function serviceUsesEndpoint(service) {
  return service !== 'Google Cal'
}
