/**
* Covers various admin-facing editing scenarios
* 
* Unlike eventSubmissionTest (as of this writing), the tests in this file are
* independent of each other. However, they rely on a before (all) and after (all)
* to create an event to edit and to clean up that event at the end, respectively.
* It would probably be cleaner to do a beforeEach / afterEach but take much
* longer.
*/

context('Event editing:', () => {
  const EVENT_NAME = 'Test Event'
  const EVENT_EMAIL = 'test@te.st'
  const EVENT_IMG = 'https://via.placeholder.com/1024X512.jpg'
  const EVENT_TAG = 'test'
  const ADMIN_USERNAME = Cypress.env('admin_auth_username')
  const ADMIN_PASSWORD = Cypress.env('admin_auth_password')
  
  const DATE = new Date()
  const YEAR = DATE.getFullYear() + (DATE.getMonth() === 11 ? 1 : 0)
  const MONTH = (DATE.getMonth() + 1) % 12
  
  let EVENT_ID, VENUES

  // create an event before running test
  before(() => {
    // get the venues so we can easily identify a particular one's name
    return cy.request({
      method: 'GET',
      url: Cypress.env('api_url') + '/venues?includeDeleted=no'
    }).then((resp) => {
      VENUES = resp.body.venues

      cy.log(`!!! ${Cypress.env('api_url')}/events`)

      // create an event
      return cy.request({
        method: 'POST',
        url: Cypress.env('api_url') + '/events',
        body: {
          title: EVENT_NAME,
          date_times: [
            {
              start_time: (new Date(YEAR, MONTH, 1, 20, 0)).toISOString(),
              end_time: (new Date(YEAR, MONTH, 1, 21, 0)).toISOString()
            },
            {
              start_time: (new Date(YEAR, MONTH, 15, 20, 0)).toISOString(),
              end_time: (new Date(YEAR, MONTH, 15, 21, 0)).toISOString()
            }
          ],
          image: EVENT_IMG,
          social_image: '',
          admission_fee: 'none',
          venue_id: VENUES[0].id,
          brief_description: 'Testing 123...',
          description: '<p>Testing more 123...</p>',
          website_link: 'https://example.com/',
          eventbrite_link: '',
          fb_event_link: '',
          ticket_link: '',
          organizer_contact: EVENT_EMAIL,
          tags: [ EVENT_TAG ]
        }
      })
    }).then((resp) => {
      cy.log('!!! resp')
      cy.log('' + resp)

      // now we can easily find the event in the UI, regardless of whether
      // other events have similar / the same title
      EVENT_ID = resp.body.id
    })
  })
  
  // clean up event after run
  after(() => {
    // this doesn't work yet; the token handling isn't quite right
    // temporarily handling it through the UI (see below)
    // cy.getCookie('auth._token.auth0').then((cookie) => {
    //   cy.request({
    //     method: 'DELETE',
    //     url: Cypress.env('api_url') + '/authenticated/events/' + EVENT_ID,
    //     headers: {
    //       'x-access-token': cookie.value
    //     } 
    //   })
    // })

    // for some reason it doesn't move on from the login page
    // but admin is already logged in, so it works
    // cy.visitAsUser(ADMIN_USERNAME, ADMIN_PASSWORD, '/admin-event-edit/' + EVENT_ID)
   
    cy.visit('/admin-event-edit/' + EVENT_ID)
    // delete the event
    cy.get('.edit-container button').contains('Delete').click()
    cy.get('.v-dialog.v-dialog--active button').contains('Kill').click()

    // verify event is gone
    cy.location('pathname').should('not.include', 'admin-event-edit/')
    cy.contains('.unverified-events tr td a[href$="admin-event-edit/' + EVENT_ID + '"]').should('not.exist')
  })
  
  it('Title can be modified', () => {
    const NEW_EVENT_NAME = 'Test Event ' + Math.floor(Math.random() * 100)

    // find and open event
    cy.visitAsUser(ADMIN_USERNAME, ADMIN_PASSWORD, '/admin')
    cy.get('.unverified-events tr td a[href$="admin-event-edit/' + EVENT_ID + '"]').click()
    cy.location('pathname').should('include', 'admin-event-edit')

    // modify its title, wait for it to save
    cy.get('.event-title input').clear().type(NEW_EVENT_NAME)
    cy.get('.edit-container button').contains('Save').click()
    cy.contains('#notify', 'Content of the event updated.')

    // navigate back to admin page
    cy.visit('/events/' + EVENT_ID)
    cy.get('.event-heading-text h1').contains(NEW_EVENT_NAME)
  })
  
  it('Date and Time can be modified', function () {
    // use new Intl support to test formatting
    // formatting is actually done w/ moment, but I don't want to make that
    // a dependency of the E2E tests
    const formatter = new Intl.DateTimeFormat('default', { month: 'long', weekday: 'long', day: 'numeric' })
  
    // w/ Title test we know we can navigate to it from main admin page,
    // so same some time and just navigate directly to is
    cy.visitAsUser(ADMIN_USERNAME, ADMIN_PASSWORD, '/admin-event-edit/' + EVENT_ID)

    // add a new datetime
    // advance calendar one month and select the 10th
    cy.get('#cal-container .v-date-picker-header > button:last-child').click()
    cy.wait(1000) // wait for calendar animation to complete
    cy.get('#cal-container .v-date-picker-table button').contains('10').click()

    cy.get('.start-hour').type('9')
    cy.get('.start-minute').type('00')
    cy.get('select[name=start_ampm]').select('PM')

    cy.get('.end-hour').type('10')
    cy.get('.end-minute').type('00')
    cy.get('select[name=end_ampm]').select('PM')
    cy.get('.time-confirm:not([disabled])').click()

    // edit second datetime
    cy.get('#all-confirmed-times-dates tr:nth-child(2) button').contains('Edit').click()
    // calendar should already be on the correct month; choose the 20th
    cy.get('#cal-container .v-date-picker-table button').contains('20').click()

    cy.get('.start-hour').type('9')
    cy.get('.start-minute').type('00')
    cy.get('select[name=start_ampm]').select('PM')

    cy.get('.end-hour').type('10')
    cy.get('.end-minute').type('00')
    cy.get('select[name=end_ampm]').select('PM')
    cy.get('.time-update:not([disabled])').click()

    // delete first datetime
    cy.get('#all-confirmed-times-dates tr:first-child button').contains('Delete').click()

    // save
    cy.get('.edit-container button').contains('Save').click()
    cy.contains('#notify', 'Content of the event updated.')

    cy.visit('/events/' + EVENT_ID)
    cy.get('.date-time-container').contains(formatter.format(new Date(YEAR, MONTH, 10, 20, 0)))
    cy.get('.date-time-container').contains(formatter.format(new Date(YEAR, MONTH, 20, 20, 0)))
    cy.get('.date-time-container').contains(formatter.format(new Date(YEAR, MONTH,  1, 20, 0))).should('not.exist')
    cy.get('.date-time-container').contains(formatter.format(new Date(YEAR, MONTH, 15, 20, 0))).should('not.exist')
})

  it('Venue can be modified', function () {
    const NEW_VENUE = VENUES[1]

    cy.visitAsUser(ADMIN_USERNAME, ADMIN_PASSWORD, '/admin-event-edit/' + EVENT_ID)

    // use Venue field to change
    cy.get('.venue').focus().clear()

    cy.get('.results-container > :nth-child(2)').click()
    cy.get('.venue').should('have.value', VENUES[1].name)

    cy.get('.edit-container button').contains('Save').click()
    cy.contains('#notify', 'Content of the event updated.')

    cy.visit('/events/' + EVENT_ID)
    cy.get('.event-heading-text h3').contains(NEW_VENUE.name)
  })

  it('Image can be modified', function () {
    cy.visitAsUser(ADMIN_USERNAME, ADMIN_PASSWORD, '/admin-event-edit/' + EVENT_ID)

    // current image preview exists
    cy.get('.preview-image img').should('have.attr', 'src', EVENT_IMG)

    // select new image
    cy.get('#event-image').selectFile('images/event_sample_image.jpg')

    cy.get('.edit-container button').contains('Save').click()
    cy.contains('#notify', 'Content of the event updated.')

    // don't know what the new image's URI will be, so extract it from the preview
    cy.reload()
    cy.get('.preview-image img:not([src="' + EVENT_IMG + '"])').invoke('attr', 'src').then(($src) => {
      // now that we know what the new image is, check it on the events page
      // this _must_ be here; Cypress docs say commands outside the promise
      // will execute after this func has finished, but they lie
      cy.visit('/events/' + EVENT_ID)
      cy.get('.event-heading img').should('have.attr', 'src', $src)
    })
  })

  it('Tags can be modified', function () { // done
    const NEW_TAG = 'other-tag'

    cy.visitAsUser(ADMIN_USERNAME, ADMIN_PASSWORD, '/admin-event-edit/' + EVENT_ID)

    // remove existing tag, add a different one
    cy.get('.tags .v-chip').contains(EVENT_TAG)
    cy.get('.tags .v-chip .v-chip__close').click()
    cy.get('.tags input').clear().type(NEW_TAG + '{enter}').blur()
    cy.get('.tags .v-chip').contains(NEW_TAG)

    cy.get('.edit-container button').contains('Save').click()
    cy.contains('#notify', 'Content of the event updated.')

    // tags aren't displayed on public pages, so just refresh and ensure the
    // edit persisted
    cy.reload()
    cy.get('.tags .v-chip').contains(NEW_TAG)
    cy.get('.tags .v-chip').contains(EVENT_TAG).should('not.exist')
  })
})
