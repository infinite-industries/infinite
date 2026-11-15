import { parsePrefillQuery, firstString, MAX_TEXT_LENGTH, MAX_BRIEF_DESCRIPTION_LENGTH } from '@/services/EventPrefillService'
import { mutations } from '@/store/index'
import { getEmptyCalendarEvent } from '@/services/ResourceTemplateService'

describe('EventPrefillService', () => {
  let warn

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warn.mockRestore()
  })

  describe('parsePrefillQuery', () => {
    it('returns {} for empty / missing input', () => {
      expect(parsePrefillQuery({})).toEqual({})
      expect(parsePrefillQuery(undefined)).toEqual({})
      expect(parsePrefillQuery(null)).toEqual({})
      expect(warn).not.toHaveBeenCalled()
    })

    it('accepts a valid value for each field', () => {
      expect(parsePrefillQuery({
        title: 'Foo',
        brief_description: 'A short thing',
        admission_fee: '$5',
        mode: 'online',
        organizer_contact: 'a@b.co',
      })).toEqual({
        title: 'Foo',
        brief_description: 'A short thing',
        admission_fee: '$5',
        mode: 'online',
        organizer_contact: 'a@b.co',
      })
      expect(warn).not.toHaveBeenCalled()
    })

    it.each(['in-person', 'online', 'hybrid'])('accepts mode %s', (mode) => {
      expect(parsePrefillQuery({ mode })).toEqual({ mode })
    })

    it('trims text values', () => {
      expect(parsePrefillQuery({ title: '  Foo  ', organizer_contact: ' a@b.co ' }))
        .toEqual({ title: 'Foo', organizer_contact: 'a@b.co' })
    })

    it('drops empty and whitespace-only values', () => {
      expect(parsePrefillQuery({ title: '', brief_description: '   ' })).toEqual({})
      expect(warn).toHaveBeenCalledTimes(2)
    })

    it('keeps text at the length cap and drops oversized text', () => {
      const atCap = 'x'.repeat(MAX_TEXT_LENGTH)
      const over = 'x'.repeat(MAX_TEXT_LENGTH + 1)
      expect(parsePrefillQuery({ title: atCap })).toEqual({ title: atCap })
      expect(parsePrefillQuery({ title: over, admission_fee: over })).toEqual({})
      expect(warn).toHaveBeenCalledTimes(2)
    })

    it('allows a longer brief_description, up to its own cap', () => {
      const atCap = 'x'.repeat(MAX_BRIEF_DESCRIPTION_LENGTH)
      const over = 'x'.repeat(MAX_BRIEF_DESCRIPTION_LENGTH + 1)
      expect(MAX_BRIEF_DESCRIPTION_LENGTH).toBe(1500)
      expect(parsePrefillQuery({ brief_description: 'x'.repeat(MAX_TEXT_LENGTH + 1) }))
        .toEqual({ brief_description: 'x'.repeat(MAX_TEXT_LENGTH + 1) })
      expect(parsePrefillQuery({ brief_description: atCap })).toEqual({ brief_description: atCap })
      expect(parsePrefillQuery({ brief_description: over })).toEqual({})
      expect(warn).toHaveBeenCalledTimes(1)
    })

    it('drops an invalid mode', () => {
      expect(parsePrefillQuery({ mode: 'virtual' })).toEqual({})
      expect(parsePrefillQuery({ mode: 'ONLINE' })).toEqual({})
      expect(warn).toHaveBeenCalledTimes(2)
    })

    it('drops an invalid email', () => {
      expect(parsePrefillQuery({ organizer_contact: 'not-an-email' })).toEqual({})
      expect(parsePrefillQuery({ organizer_contact: 'a@b' })).toEqual({})
      expect(warn).toHaveBeenCalledTimes(2)
    })

    it('uses the first string of a repeated param', () => {
      expect(parsePrefillQuery({ title: ['First', 'Second'] })).toEqual({ title: 'First' })
      expect(parsePrefillQuery({ mode: [null, 'hybrid'] })).toEqual({ mode: 'hybrid' })
    })

    it('ignores non-string values', () => {
      // vue-router gives null for a bare `?title`
      expect(parsePrefillQuery({ title: null, mode: [null] })).toEqual({})
      expect(warn).toHaveBeenCalledTimes(2)
    })

    it('ignores unknown params, including existing ones like partner / only', () => {
      expect(parsePrefillQuery({ partner: 'wrfl', only: null, foo: 'bar', id: '123', title: 'Foo' }))
        .toEqual({ title: 'Foo' })
      expect(warn).not.toHaveBeenCalled()
    })

    it('drops invalid values one by one and keeps the rest', () => {
      expect(parsePrefillQuery({ title: 'Foo', mode: 'nope', organizer_contact: 'bad' }))
        .toEqual({ title: 'Foo' })
      expect(warn).toHaveBeenCalledTimes(2)
    })
  })

  describe('firstString', () => {
    it('handles strings, arrays and other values', () => {
      expect(firstString('a')).toBe('a')
      expect(firstString(['a', 'b'])).toBe('a')
      expect(firstString([])).toBeUndefined()
      expect(firstString(null)).toBeUndefined()
      expect(firstString(5)).toBeUndefined()
    })
  })

  describe('CREATE_NEW_EVENT mutation', () => {
    it('creates an empty event when given no overrides', () => {
      const state = {}
      mutations.CREATE_NEW_EVENT(state)
      expect(state.calendar_event).toEqual(getEmptyCalendarEvent())
    })

    it('merges overrides over the empty event', () => {
      const state = {}
      mutations.CREATE_NEW_EVENT(state, { title: 'Foo', mode: 'online' })
      expect(state.calendar_event).toEqual({ ...getEmptyCalendarEvent(), title: 'Foo', mode: 'online' })
    })
  })
})
