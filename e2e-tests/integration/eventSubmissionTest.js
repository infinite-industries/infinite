/// <reference types="Cypress" />

/**
 * The tests in this file are cumulative and must be ran in sequence
 */

context('Event Submission', () => {
  const EVENT_NAME = 'Test Event'
  const EVENT_EMAIL = 'test@te.st'
  const ADMIN_USERNAME = Cypress.env('admin_auth_username')
  const ADMIN_PASSWORD = Cypress.env('admin_auth_password')

  const getElementText = $el => $el.text().trim()

  // Performs cleanup after all specs in this file have run
  after(() => {
    cy.visitAsUser(ADMIN_USERNAME, ADMIN_PASSWORD, '/')

    cy.contains('.infinite-card', EVENT_NAME)
      .contains('.more-info', 'More Info').click()
      .get('.event-heading')
      .url().then((url) => {
      // open the admin-event-edit page for the event
        cy.visit('/admin-event-edit/' + url.split('/').pop())

        // delete the event
        cy.get('.edit-container button').contains('Delete').click()
        cy.get('.v-dialog.v-dialog--active button').contains('Kill').click()

        // event should no longer be present
        cy.visit('/')
        cy.contains('.infinite-card h3', EVENT_NAME).should('not.exist')
      })
  })

  it('Inputs dummy data into event submission form', () => {
    const TEMP_EVENT_NAME = 'Temporary Title'
    cy.visit('/submit-event')
    cy.get('.event-title input').type(TEMP_EVENT_NAME)

    // can't select dates in the past
    // advance calendar one month and select the first
    cy.get('#cal-container .v-date-picker-header > button:last-child').click()
    cy.wait(1000) // wait for calendar animation to complete
    cy.get('#cal-container .v-date-picker-table button').contains('1').click()

    cy.get('.start-hour').type('9')
    cy.get('.start-minute').type('00')
    cy.get('select[name=start_ampm]').select('PM')

    cy.get('.end-hour').type('10')
    cy.get('.end-minute').type('00')
    cy.get('select[name=end_ampm]').select('PM')
    cy.get('.time-confirm:not([disabled])').click()

    // selectFile is a custom command; see cypress/support/commands.js
    cy.get('#event-image').selectFile('images/event_sample_image.jpg')

    cy.get('.venue').focus()
    cy.get('.results-container > :first-child').click()

    cy.get('.brief-description input').type('still testing')
    cy.get('.submitter-email input').type(EVENT_EMAIL)

    // preview submission
    cy.get('.submit-container button').click()
    cy.get('.event-preview').should('exist')
    cy.get('.event .event-heading h1').contains(TEMP_EVENT_NAME).should('exist')
    cy.get('.infinite-card h3').contains(TEMP_EVENT_NAME).should('exist')
    // check that venue field contains something
    // (we just choose the first venue that comes up when the picker is focused,
    // so we don't know the exact text to look for)
    cy.get('.event .event-heading h3').then(getElementText).should('not.be.empty')
    cy.get('.infinite-card h4').then(getElementText).should('not.be.empty')

    // go back to submission form, check that form is still populated
    cy.get('.preview-controls button:last-child').click()
    cy.get('.event-title input').should('have.value', TEMP_EVENT_NAME)
    cy.get('.submitter-email input').should('have.value', EVENT_EMAIL)

    // update event title and preview again
    cy.get('.event-title input').clear().type(EVENT_NAME)
    cy.get('.submit-container button').click()
    cy.get('.event-preview').should('exist')
    cy.get('.event .event-heading h1').contains(EVENT_NAME).should('exist')
    cy.get('.infinite-card h3').contains(EVENT_NAME).should('exist')
    cy.get('.event .event-heading h3').then(getElementText).should('not.be.empty')
    cy.get('.infinite-card h4').then(getElementText).should('not.be.empty')

    // submission event for real
    cy.get('.preview-controls button:first-child').click()
    cy.get('h1.centered-header').contains('Thank you!').should('exist')
  })

  it('Submitted events not displayed immediately after submission', function () {
    cy.visit('/')
    cy.contains('.infinite-card h3', EVENT_NAME).should('not.exist')
  })

  it('Admin user can verify event', function () {
    cy.visitAsUser(ADMIN_USERNAME, ADMIN_PASSWORD, '/')

    cy.get('#hamburger').click()
    cy.get('#nav-list li').contains('Admin').click()
    cy.location('pathname').should('include', 'admin')
    cy.contains('.unverified-events tr:first-child td', EVENT_NAME)
    cy.get('.unverified-events tr:first-child a').contains('Edit').click()
    cy.location('pathname').should('include', 'admin-event-edit')
    cy.get('.submitter-email input').should('have.value', EVENT_EMAIL)

    cy.get('button.btn-verify').click()
    cy.get('.calendar-events-table')
    cy.contains('.unverified-events tr:first-child td', EVENT_NAME).should('not.exist')
    cy.contains('.current-events td', EVENT_NAME).should('exist')
    // cy.get('.alert.alert--dismissible').contains('Success! Event verified.')
  })

  it('Event is displayed after verification', function () {
    cy.visit('/')
    cy.contains('.infinite-card h3', EVENT_NAME).should('exist')
  })
})
