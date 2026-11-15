/**
 * EventPrefillService
 *
 * Turns `/submit-event` query params into a partial calendar event that is
 * merged over `getEmptyCalendarEvent()` before the submission form mounts.
 * Lets an agent or human provide a link with the form pre-populated.
 *
 * Param contract (all optional; param names match event field names):
 *
 * | Param               | Rule                                             |
 * |---------------------|--------------------------------------------------|
 * | `title`             | trimmed string, 1..255 chars                     |
 * | `brief_description` | trimmed string, 1..1500 chars                    |
 * | `admission_fee`     | trimmed string, 1..255 chars                     |
 * | `mode`              | one of `in-person`, `online`, `hybrid`           |
 * | `organizer_contact` | trimmed, must match /\S+@\S+\.\S+/, <= 255 chars |
 *
 * - A repeated param (array value) uses its first string.
 * - Invalid values are dropped one by one (never truncated) with a
 *   console.warn; valid values still apply.
 * - Unknown params are ignored.
 * - The 255 cap matches the VARCHAR(255) DB columns (title, admission_fee,
 *   organizer_contact). brief_description is TEXT in the DB; 1500 is a
 *   safety cap for URL length (prod max seen ~1700, most < 1000).
 *
 * To add a param, add an entry to FIELD_PARSERS.
 */

export const MAX_TEXT_LENGTH = 255
export const MAX_BRIEF_DESCRIPTION_LENGTH = 1500
// keep in sync with SubmissionForm.vue `isEmail`
export const EMAIL_REGEX = /\S+@\S+\.\S+/
export const EVENT_MODES = ['in-person', 'online', 'hybrid']

const ok = (value) => ({ ok: true, value })
const fail = (reason) => ({ ok: false, reason })

/**
 * Returns the first string for a query value, or undefined.
 * @param {unknown} value
 * @returns {string | undefined}
 */
export function firstString(value) {
  if (Array.isArray(value)) {
    return value.find((v) => typeof v === 'string')
  }
  return typeof value === 'string' ? value : undefined
}

function textField(maxLength = MAX_TEXT_LENGTH) {
  return (raw) => {
    const value = raw.trim()
    if (value === '') return fail('empty')
    if (value.length > maxLength) return fail(`longer than ${maxLength} characters`)
    return ok(value)
  }
}

function enumField(allowed) {
  return (raw) => {
    const value = raw.trim()
    return allowed.includes(value)
      ? ok(value)
      : fail(`must be one of ${allowed.join(', ')}`)
  }
}

function emailField(maxLength = MAX_TEXT_LENGTH) {
  const text = textField(maxLength)
  return (raw) => {
    const result = text(raw)
    if (!result.ok) return result
    return EMAIL_REGEX.test(result.value) ? result : fail('not a valid email address')
  }
}

/** param name (== event field name) -> parser(rawString) => { ok, value | reason } */
const FIELD_PARSERS = {
  title: textField(),
  brief_description: textField(MAX_BRIEF_DESCRIPTION_LENGTH),
  admission_fee: textField(),
  mode: enumField(EVENT_MODES),
  organizer_contact: emailField(),
}

/**
 * @param {Record<string, unknown> | null | undefined} query e.g. `useRoute().query`
 * @returns {Partial<ReturnType<import('./ResourceTemplateService').getEmptyCalendarEvent>>}
 */
export function parsePrefillQuery(query) {
  const prefill = {}
  if (!query || typeof query !== 'object') return prefill

  for (const [param, parse] of Object.entries(FIELD_PARSERS)) {
    if (!Object.prototype.hasOwnProperty.call(query, param)) continue

    const raw = firstString(query[param])
    const result = raw === undefined ? fail('not a string') : parse(raw)

    if (result.ok) {
      prefill[param] = result.value
    } else {
      console.warn(`[prefill] ignoring "${param}": ${result.reason}`)
    }
  }

  return prefill
}
