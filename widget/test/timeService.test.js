import moment from 'moment'

import TimeService from '../src/timeService.js'

const utc_time_test1 = '2020-01-01T01:33:00.000Z'
const utc_time_test2 = '2020-01-29T12:00:00.000Z'
const utc_time_test3 = '2020-01-01T00:59:00.000Z'
const utc_time_test4 = '2020-12-01T23:59:00.000Z'

// NOTE: Date object automagically converts to the correct timezone based on Z suffix in date string
// That means the formatted date info may not match the original date, because
// e.g. midnight UTC is 7 or 8pm Eastern time, depending on daylight savings.

test('returns correct minutes', () => {
    expect(TimeService.returnMinutes(utc_time_test1)).toBe(33)
    expect(TimeService.returnMinutes(utc_time_test2)).toBe(0)
    expect(TimeService.returnMinutes(utc_time_test3)).toBe(59)
})

test('returns correct month', () => {
    expect(TimeService.returnMonth(utc_time_test1)).toBe(moment(utc_time_test1).format('MMMM'))
    expect(TimeService.returnMonth(utc_time_test2)).toBe(moment(utc_time_test2).format('MMMM'))
    expect(TimeService.returnMonth(utc_time_test4)).toBe(moment(utc_time_test4).format('MMMM'))
})

test('returns correct date', () => {
    // first example is 1am UTC which is evening of day before EST/EDT
    // unfortunately this test is only accurate in timezones behind UTC
    expect(TimeService.returnDate(utc_time_test1).toString()).toBe(moment(utc_time_test1).format('D'))
    expect(TimeService.returnDate(utc_time_test2).toString()).toBe(moment(utc_time_test2).format('D'))
})

test('returns correct day of week', () => {
    expect(TimeService.returnDay(utc_time_test1)).toBe(moment(utc_time_test1).format('dddd'))
    expect(TimeService.returnDay(utc_time_test2)).toBe(moment(utc_time_test2).format('dddd'))
    expect(TimeService.returnDay(utc_time_test3)).toBe(moment(utc_time_test3).format('dddd'))
})
