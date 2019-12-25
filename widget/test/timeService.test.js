import TimeService from '../src/timeService.js'

const utc_time_test1 = '2020-01-01T01:33:00.000Z'
const utc_time_test2 = '2020-01-29T12:00:00.000Z'
const utc_time_test3 = '2020-01-01T00:59:00.000Z'
const utc_time_test4 = '2020-12-01T23:59:00.000Z'

// NOTE: Date object automagically converts to the correct timezone based on Z suffix in date string

test('returns correct minutes', () => {
    expect(TimeService.returnMinutes(utc_time_test1)).toBe(33)
    expect(TimeService.returnMinutes(utc_time_test3)).toBe(59)
})

test('returns correct month', () => {
    expect(TimeService.returnMonth(utc_time_test2)).toBe("January")
    expect(TimeService.returnMonth(utc_time_test4)).toBe("December")
})
